package com.personal.fitanalyzer.service;

import com.personal.fitanalyzer.config.SecurityUtils;
import com.personal.fitanalyzer.domain.MuscleGroups;
import com.personal.fitanalyzer.domain.RunWorkout;
import com.personal.fitanalyzer.domain.StrengthWorkout;
import com.personal.fitanalyzer.domain.TrainingDay;
import com.personal.fitanalyzer.domain.TrainingDayEntry;
import com.personal.fitanalyzer.domain.TrainingPlan;
import com.personal.fitanalyzer.domain.User;
import com.personal.fitanalyzer.domain.Workout;
import com.personal.fitanalyzer.domain.enums.Goal;
import com.personal.fitanalyzer.domain.enums.RunType;
import com.personal.fitanalyzer.domain.enums.WorkoutType;
import com.personal.fitanalyzer.domain.enums.Zone;
import com.personal.fitanalyzer.dto.SuggestionRequestDTO;
import com.personal.fitanalyzer.dto.SuggestionResponseDTO;
import com.personal.fitanalyzer.exception.ResourceNotFoundException;
import com.personal.fitanalyzer.repository.MuscleGroupRepository;
import com.personal.fitanalyzer.repository.RunWorkoutRepository;
import com.personal.fitanalyzer.repository.StrengthWorkoutRepository;
import com.personal.fitanalyzer.repository.TrainingPlanRepository;
import com.personal.fitanalyzer.repository.UserRepository;
import com.personal.fitanalyzer.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.OptionalDouble;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SuggestionEngineService {

    private final WorkoutRepository workoutRepository;
    private final StrengthWorkoutRepository strengthWorkoutRepository;
    private final UserRepository userRepository;
    private final MuscleGroupRepository muscleGroupRepository;
    private final TrainingPlanRepository trainingPlanRepository;
    private final RunWorkoutRepository runWorkoutRepository;
    private final SecurityUtils securityUtils;

    public SuggestionResponseDTO getSuggestion(Long userId, SuggestionRequestDTO request) {
        securityUtils.validateUserAccess(userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        List<Workout> recentWorkouts = workoutRepository.findByUserId(userId);
        List<Long> painfulMuscleIds = runWorkoutRepository
                .findByUserId(userId).stream()
                .filter(w -> ChronoUnit.HOURS.between(w.getDate(), LocalDateTime.now()) <= 48)
                .flatMap(w -> w.getPainfulMuscles().stream())
                .map(MuscleGroups::getId)
                .distinct()
                .collect(Collectors.toList());
        String intensity = calculateIntensity(recentWorkouts, user.getGoal());
        Map<String, Float> fatigue = calculateMuscleFatigue(userId);

        Optional<TrainingPlan> planOpt = trainingPlanRepository.findByUserId(userId);
        if (planOpt.isPresent()) {
            DayOfWeek today = LocalDateTime.now().getDayOfWeek();
            planOpt.get().getTrainingDays().stream()
                    .map(d -> d.getDayOfWeek().toString())
                    .collect(Collectors.joining(", "));
            return suggestFromPlan(planOpt.get(), user, painfulMuscleIds, intensity, fatigue, recentWorkouts);
        }
        return null;
    }

    private SuggestionResponseDTO suggestFromPlan(
            TrainingPlan plan, User user,
            List<Long> painfulMuscleIds, String intensity,
            Map<String, Float> fatigue, List<Workout> recentWorkouts) {

        DayOfWeek today = LocalDateTime.now().getDayOfWeek();

        Optional<TrainingDay> todayOpt = plan.getTrainingDays().stream()
                .filter(d -> d.getDayOfWeek() == today)
                .findFirst();

        TrainingDay trainingDay = todayOpt.orElseGet(() -> nextReadyDay(plan, today, fatigue));

        if (trainingDay == null) {
            return restSuggestion(fatigue, plan, today);
        }

        boolean allRest = trainingDay.getTrainingDayEntries().stream()
                .allMatch(e -> e.getWorkoutType() == WorkoutType.REST);
        if (allRest) {
            return restSuggestion(fatigue, plan, today);
        }

        Optional<TrainingDayEntry> strengthEntry = trainingDay.getTrainingDayEntries().stream()
                .filter(e -> e.getWorkoutType() == WorkoutType.STRENGTH)
                .findFirst();

        if (strengthEntry.isPresent()) {
            SuggestionResponseDTO suggestion = buildStrengthSuggestion(
                    strengthEntry.get().getMuscleGroups(),
                    painfulMuscleIds, intensity, fatigue, user.getId()
            );

            if (suggestion == null) {
                return restSuggestion(fatigue, plan, today);
            }
            return suggestion;
        }

        return buildRunSuggestion(intensity, fatigue);
    }

    private TrainingDay nextPlannedDay(TrainingPlan plan, DayOfWeek today) {
        return plan.getTrainingDays().stream()
                .filter(d -> d.getDayOfWeek() != today)
                .filter(d -> d.getTrainingDayEntries().stream()
                        .anyMatch(e -> e.getWorkoutType() != WorkoutType.REST))
                .min(Comparator.comparingInt(d -> {
                    int diff = d.getDayOfWeek().getValue() - today.getValue();
                    return diff <= 0 ? diff + 7 : diff;
                }))
                .orElse(null);
    }

    private SuggestionResponseDTO restSuggestion(Map<String, Float> fatigue, TrainingPlan plan, DayOfWeek today) {
        TrainingDay nextDay = nextReadyDay(plan, today, fatigue);

        String message;
        List<MuscleGroups> nextMuscles = null;

        if (nextDay == null) {
            message = "Hoje é dia de descanso! Todos os músculos planejados ainda estão em recuperação.";
        } else {
            Optional<TrainingDayEntry> nextStrength = nextDay.getTrainingDayEntries().stream()
                    .filter(e -> e.getWorkoutType() == WorkoutType.STRENGTH)
                    .findFirst();

            if (nextStrength.isPresent()) {
                nextMuscles = nextStrength.get().getMuscleGroups();
                String muscleNames = nextMuscles.stream()
                        .map(MuscleGroups::getName)
                        .collect(Collectors.joining(", "));
                message = "Hoje é dia de descanso! Próximo treino: " + nextDay.getDayOfWeek() + " — " + muscleNames + ".";
            } else {
                message = "Hoje é dia de descanso! Próximo treino: " + nextDay.getDayOfWeek() + " — Corrida.";
            }
        }

        return new SuggestionResponseDTO(
                WorkoutType.REST, message, nextMuscles,
                null, null, null, null, "LOW", fatigue
        );
    }

    private TrainingDay nextReadyDay(TrainingPlan plan, DayOfWeek today, Map<String, Float> fatigue) {
        return plan.getTrainingDays().stream()
                .filter(d -> d.getDayOfWeek() != today)
                .filter(d -> d.getTrainingDayEntries().stream()
                        .anyMatch(e -> e.getWorkoutType() != WorkoutType.REST))
                .filter(d -> {
                    boolean isRunDay = d.getTrainingDayEntries().stream()
                            .allMatch(e -> e.getWorkoutType() == WorkoutType.RUN);
                    if (isRunDay) return true;

                    return d.getTrainingDayEntries().stream()
                            .filter(e -> e.getWorkoutType() == WorkoutType.STRENGTH)
                            .flatMap(e -> e.getMuscleGroups().stream())
                            .anyMatch(m -> fatigue.getOrDefault(m.getName(), 0f) < 30f);
                })
                .min(Comparator.comparingInt(d -> {
                    int diff = d.getDayOfWeek().getValue() - today.getValue();
                    return diff <= 0 ? diff + 7 : diff;
                }))
                .orElse(null);
    }

    private SuggestionResponseDTO buildStrengthSuggestion(
            List<MuscleGroups> plannedMuscles,
            List<Long> painfulMuscleIds,
            String intensity,
            Map<String, Float> fatigue,
            Long userId) {

        List<StrengthWorkout> strengthWorkouts = strengthWorkoutRepository.findByUserId(userId);
        LocalDateTime now = LocalDateTime.now();

        List<MuscleGroups> readyMuscles = plannedMuscles.stream()
                .filter(m -> !painfulMuscleIds.contains(m.getId()))
                .filter(m -> {
                    return strengthWorkouts.stream()
                            .filter(w -> w.getMuscles().contains(m))
                            .map(Workout::getDate)
                            .max(Comparator.naturalOrder())
                            .map(lastTrained -> {
                                long hoursAgo = ChronoUnit.HOURS.between(lastTrained, now);
                                return hoursAgo >= m.getRecoveryHours();
                            })
                            .orElse(true);
                })
                .collect(Collectors.toList());

        Integer suggestedSets = intensity.equals("HIGH") ? 5 : intensity.equals("MEDIUM") ? 4 : 3;

        List<MuscleGroups> fatiguedMuscles = plannedMuscles.stream()
                .filter(m -> !readyMuscles.contains(m))
                .collect(Collectors.toList());

        String message;
        if (fatiguedMuscles.isEmpty()) {
            message = "Todos os músculos de hoje estão recuperados. Bora treinar!";
        } else {
            String fatiguedNames = fatiguedMuscles.stream()
                    .map(MuscleGroups::getName)
                    .collect(Collectors.joining(", "));
            message = "Atenção: " + fatiguedNames + " ainda estão em recuperação. Treine com cautela!";
        }

        if (readyMuscles.isEmpty()) {
            return null;
        }

        return new SuggestionResponseDTO(
                WorkoutType.STRENGTH, message, readyMuscles,
                suggestedSets, null, null, null, intensity, fatigue
        );
    }

    private SuggestionResponseDTO buildRunSuggestion(String intensity, Map<String, Float> fatigue) {
        Zone suggestedZone = intensity.equals("HIGH") ? Zone.Z4 : intensity.equals("MEDIUM") ? Zone.Z3 : Zone.Z2;
        Float suggestedKm = intensity.equals("HIGH") ? 8f : intensity.equals("MEDIUM") ? 6f : 4f;
        RunType runType = intensity.equals("HIGH") ? RunType.INTERVAL : intensity.equals("MEDIUM") ? RunType.TEMPO : RunType.EASY;
        String message = "Sugerimos uma corrida " + runType.name().toLowerCase() + " de " + suggestedKm + "km na zona " + suggestedZone.name();

        return new SuggestionResponseDTO(
                WorkoutType.RUN, message, null,
                null, suggestedZone, suggestedKm, runType, intensity, fatigue
        );
    }

    private SuggestionResponseDTO suggestFromHistory(
            List<Workout> recentWorkouts, User user,
            List<Long> painfulMuscleIds, String intensity,
            Map<String, Float> fatigue) {

        WorkoutType workoutType = decideWorkoutType(recentWorkouts, user.getGoal(), painfulMuscleIds);

        if (workoutType == WorkoutType.STRENGTH) {
            List<MuscleGroups> recoveredMuscles = getRecoveredMuscles(user.getId(), painfulMuscleIds);
            Integer suggestedSets = intensity.equals("HIGH") ? 5 : intensity.equals("MEDIUM") ? 4 : 3;
            String message = recoveredMuscles.isEmpty()
                    ? "Todos os músculos ainda estão em recuperação. Considere um treino leve ou descanso."
                    : "Esses músculos já recuperaram e estão prontos para treinar!";

            return new SuggestionResponseDTO(
                    workoutType, message, recoveredMuscles,
                    suggestedSets, null, null, null, intensity, fatigue
            );
        }

        return buildRunSuggestion(intensity, fatigue);
    }

    private WorkoutType decideWorkoutType(List<Workout> recentWorkouts, Goal goal, List<Long> painfulMuscleIds) {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        long strengthCount = recentWorkouts.stream()
                .filter(w -> w.getDate().isAfter(oneWeekAgo))
                .filter(w -> w instanceof StrengthWorkout)
                .count();
        long runCount = recentWorkouts.stream()
                .filter(w -> w.getDate().isAfter(oneWeekAgo))
                .filter(w -> w instanceof RunWorkout)
                .count();

        long totalCount = strengthCount + runCount;
        if (totalCount == 0) return WorkoutType.STRENGTH;

        float strengthRatio = (float) strengthCount / totalCount;
        float idealStrengthRatio = getIdealStrengthRatio(goal);

        if (strengthRatio < idealStrengthRatio) return WorkoutType.STRENGTH;
        return WorkoutType.RUN;
    }

    private float getIdealStrengthRatio(Goal goal) {
        return switch (goal) {
            case HYPERTROPHY -> 0.80f;
            case STRENGTH -> 0.85f;
            case FAT_LOSS -> 0.50f;
            case ENDURANCE -> 0.20f;
            case FITNESS -> 0.60f;
            case REHABILITATION -> 0.70f;
        };
    }

    private List<MuscleGroups> getRecoveredMuscles(Long userId, List<Long> painfulMuscleIds) {
        List<MuscleGroups> allMuscles = muscleGroupRepository.findAll();
        LocalDateTime now = LocalDateTime.now();
        List<StrengthWorkout> strengthWorkouts = strengthWorkoutRepository.findByUserId(userId);

        return allMuscles.stream()
                .filter(muscle -> !painfulMuscleIds.contains(muscle.getId()))
                .filter(muscle -> strengthWorkouts.stream()
                        .filter(w -> w.getMuscles().contains(muscle))
                        .map(Workout::getDate)
                        .max(Comparator.naturalOrder())
                        .map(lastTrained -> {
                            long hoursAgo = ChronoUnit.HOURS.between(lastTrained, now);
                            return hoursAgo >= muscle.getRecoveryHours();
                        })
                        .orElse(true))
                .collect(Collectors.toList());
    }

    private Map<String, Float> calculateMuscleFatigue(Long userId) {
        List<MuscleGroups> allMuscles = muscleGroupRepository.findAll();
        List<StrengthWorkout> strengthWorkouts = strengthWorkoutRepository.findByUserId(userId);
        List<RunWorkout> runWorkouts = runWorkoutRepository.findByUserId(userId);
        LocalDateTime now = LocalDateTime.now();
        Map<String, Float> fatigue = new HashMap<>();

        allMuscles.forEach(muscle -> {
            OptionalDouble strengthFatigue = strengthWorkouts.stream()
                    .filter(w -> w.getMuscles().contains(muscle))
                    .map(Workout::getDate)
                    .max(Comparator.naturalOrder())
                    .map(lastTrained -> {
                        long hoursAgo = ChronoUnit.HOURS.between(lastTrained, now);
                        return (double) Math.max(0, 100 - (hoursAgo * 100f / muscle.getRecoveryHours()));
                    })
                    .map(OptionalDouble::of)
                    .orElse(OptionalDouble.empty());

            OptionalDouble runFatigue = runWorkouts.stream()
                    .filter(w -> w.getPainfulMuscles().contains(muscle))
                    .map(Workout::getDate)
                    .max(Comparator.naturalOrder())
                    .map(lastTrained -> {
                        long hoursAgo = ChronoUnit.HOURS.between(lastTrained, now);
                        return (double) Math.max(0, 100 - (hoursAgo * 100f / 48f));
                    })
                    .map(OptionalDouble::of)
                    .orElse(OptionalDouble.empty());

            double finalFatigue = Math.max(
                    strengthFatigue.orElse(0),
                    runFatigue.orElse(0)
            );

            fatigue.put(muscle.getName(), (float) finalFatigue);
        });

        return fatigue;
    }

    private String calculateIntensity(List<Workout> recentWorkouts, Goal goal) {
        if (recentWorkouts.isEmpty()) return "MEDIUM";

        double avgEffort = recentWorkouts.stream()
                .sorted(Comparator.comparing(Workout::getDate).reversed())
                .limit(3)
                .mapToInt(Workout::getEffort)
                .average()
                .orElse(5.0);

        if (goal == Goal.HYPERTROPHY || goal == Goal.STRENGTH) {
            if (avgEffort < 5) return "HIGH";
            if (avgEffort < 7) return "MEDIUM";
            return "LOW";
        }
        if (goal == Goal.FAT_LOSS || goal == Goal.ENDURANCE) {
            if (avgEffort < 4) return "HIGH";
            if (avgEffort < 6) return "MEDIUM";
            return "LOW";
        }
        if (avgEffort < 4) return "MEDIUM";
        return "LOW";
    }
}