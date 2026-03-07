package com.personal.fitanalyzer.service;

import com.personal.fitanalyzer.domain.MuscleGroups;
import com.personal.fitanalyzer.domain.RunWorkout;
import com.personal.fitanalyzer.domain.StrengthWorkout;
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
import com.personal.fitanalyzer.repository.UserRepository;
import com.personal.fitanalyzer.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SuggestionEngineService {

    private final WorkoutRepository workoutRepository;
    private final StrengthWorkoutRepository strengthWorkoutRepository;
    private final RunWorkoutRepository runWorkoutRepository;
    private final UserRepository userRepository;
    private final MuscleGroupRepository muscleGroupRepository;

    public SuggestionResponseDTO getSuggestion(Long userId, SuggestionRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        List<Workout> recentWorkouts = workoutRepository.findByUserId(userId);
        List<Long> painfulMuscleIds = request.painfulMuscleIds() != null ? request.painfulMuscleIds() : List.of();

        WorkoutType workoutType = decideWorkoutType(recentWorkouts, user.getGoal(), painfulMuscleIds);
        String intensity = calculateIntensity(recentWorkouts, user.getGoal());
        Map<String, Float> fatigue = calculateMuscleFatigue(userId);

        if (workoutType == WorkoutType.STRENGTH) {
            List<MuscleGroups> recoveredMuscles = getRecoveredMuscles(userId, painfulMuscleIds);
            Integer suggestedSets = intensity.equals("HIGH") ? 5 : intensity.equals("MEDIUM") ? 4 : 3;
            String message = recoveredMuscles.isEmpty()
                    ? "Todos os músculos ainda estão em recuperação. Considere um treino leve ou descanso."
                    : "Esses músculos já recuperaram e estão prontos para treinar!";

            return new SuggestionResponseDTO(
                    workoutType, message, recoveredMuscles,
                    suggestedSets, null, null, null, intensity, fatigue
            );
        }

        // RUN
        Zone suggestedZone = intensity.equals("HIGH") ? Zone.Z4 : intensity.equals("MEDIUM") ? Zone.Z3 : Zone.Z2;
        Float suggestedKm = intensity.equals("HIGH") ? 8f : intensity.equals("MEDIUM") ? 6f : 4f;
        RunType runType = intensity.equals("HIGH") ? RunType.INTERVAL : intensity.equals("MEDIUM") ? RunType.TEMPO : RunType.EASY;
        String message = "Sugerimos uma corrida " + runType.name().toLowerCase() + " de " + suggestedKm + "km na zona " + suggestedZone.name();

        return new SuggestionResponseDTO(
                workoutType, message, null,
                null, suggestedZone, suggestedKm, runType, intensity, fatigue
        );
    }

    private WorkoutType decideWorkoutType(List<Workout> recentWorkouts, Goal goal, List<Long> painfulMuscleIds) {

        // treinos da última semana
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
                .filter(muscle -> !painfulMuscleIds.contains(muscle.getId())) // exclui músculos com dor
                .filter(muscle -> {
                    // verifica se o músculo já recuperou
                    return strengthWorkouts.stream()
                            .filter(w -> w.getMuscles().contains(muscle))
                            .map(Workout::getDate)
                            .max(Comparator.naturalOrder())
                            .map(lastTrained -> {
                                long hoursAgo = ChronoUnit.HOURS.between(lastTrained, now);
                                return hoursAgo >= muscle.getRecoveryHours();
                            })
                            .orElse(true); // nunca foi treinado = recuperado
                })
                .collect(Collectors.toList());
    }

    private Map<String, Float> calculateMuscleFatigue(Long userId) {
        List<MuscleGroups> allMuscles = muscleGroupRepository.findAll();
        List<StrengthWorkout> strengthWorkouts = strengthWorkoutRepository.findByUserId(userId);
        LocalDateTime now = LocalDateTime.now();

        Map<String, Float> fatigue = new HashMap<>();

        allMuscles.forEach(muscle -> {
            strengthWorkouts.stream()
                    .filter(w -> w.getMuscles().contains(muscle))
                    .map(Workout::getDate)
                    .max(Comparator.naturalOrder())
                    .ifPresentOrElse(lastTrained -> {
                        long hoursAgo = ChronoUnit.HOURS.between(lastTrained, now);
                        float recoveryHours = muscle.getRecoveryHours();
                        float fatiguePercent = Math.max(0, 100 - (hoursAgo * 100f / recoveryHours));
                        fatigue.put(muscle.getName(), fatiguePercent);
                    }, () -> fatigue.put(muscle.getName(), 0f)); // nunca treinado = sem fadiga
        });

        return fatigue;
    }

    private String calculateIntensity(List<Workout> recentWorkouts, Goal goal) {
        if (recentWorkouts.isEmpty()) return "MEDIUM";

        // média de esforço dos ultimos 3 treinos
        double avgEffort = recentWorkouts.stream()
                .sorted(Comparator.comparing(Workout::getDate).reversed())
                .limit(3)
                .mapToInt(Workout::getEffort)
                .average()
                .orElse(5.0);

        if (goal == Goal.HYPERTROPHY || goal == Goal.STRENGTH) {
            if (avgEffort < 5) return "HIGH";
            if (avgEffort < 7) return "MEDIUM";
            return "LOW"; // já está treinando forte, dá uma leve
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