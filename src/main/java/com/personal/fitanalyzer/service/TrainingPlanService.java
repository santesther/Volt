package com.personal.fitanalyzer.service;

import com.personal.fitanalyzer.domain.MuscleGroups;
import com.personal.fitanalyzer.domain.TrainingDay;
import com.personal.fitanalyzer.domain.TrainingDayEntry;
import com.personal.fitanalyzer.domain.TrainingPlan;
import com.personal.fitanalyzer.domain.User;
import com.personal.fitanalyzer.domain.enums.WorkoutType;
import com.personal.fitanalyzer.dto.TrainingDayEntryResponseDTO;
import com.personal.fitanalyzer.dto.TrainingDayResponseDTO;
import com.personal.fitanalyzer.dto.TrainingPlanRequestDTO;
import com.personal.fitanalyzer.dto.TrainingPlanResponseDTO;
import com.personal.fitanalyzer.exception.ResourceNotFoundException;
import com.personal.fitanalyzer.repository.MuscleGroupRepository;
import com.personal.fitanalyzer.repository.TrainingPlanRepository;
import com.personal.fitanalyzer.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrainingPlanService {

    private final TrainingPlanRepository trainingPlanRepository;
    private final UserRepository userRepository;
    private final MuscleGroupRepository muscleGroupRepository;

    @Transactional
    public TrainingPlanResponseDTO createOrUpdate(TrainingPlanRequestDTO request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        TrainingPlan plan = trainingPlanRepository.findByUserId(request.userId())
                .orElse(new TrainingPlan());

        plan.setUser(user);

        plan.getTrainingDays().clear();

        List<TrainingDay> days = request.days().stream().map(dayDTO -> {
            TrainingDay day = new TrainingDay();
            day.setDayOfWeek(dayDTO.dayOfWeek());
            day.setTrainingPlan(plan);

            long strengthCount = dayDTO.entries().stream()
                    .filter(e -> e.workoutType() == WorkoutType.STRENGTH).count();
            long runCount = dayDTO.entries().stream()
                    .filter(e -> e.workoutType() == WorkoutType.RUN).count();
            if (strengthCount > 1 || runCount > 1) {
                throw new IllegalArgumentException(
                        "Dia " + dayDTO.dayOfWeek() + " pode ter no máximo 1 STRENGTH e 1 RUN");
            }

            List<TrainingDayEntry> entries = dayDTO.entries().stream().map(entryDTO -> {
                TrainingDayEntry entry = new TrainingDayEntry();
                entry.setWorkoutType(entryDTO.workoutType());
                entry.setTrainingDay(day);

                if (entryDTO.muscleGroupIds() != null && !entryDTO.muscleGroupIds().isEmpty()) {
                    List<MuscleGroups> muscles = entryDTO.muscleGroupIds().stream()
                            .map(id -> muscleGroupRepository.findById(id)
                                    .orElseThrow(() -> new ResourceNotFoundException("Grupo muscular não encontrado: " + id)))
                            .collect(Collectors.toList());
                    entry.setMuscleGroups(muscles);
                }

                return entry;
            }).collect(Collectors.toList());

            day.setTrainingDayEntries(entries);
            return day;
        }).collect(Collectors.toList());

        plan.getTrainingDays().addAll(days);
        TrainingPlan saved = trainingPlanRepository.save(plan);
        return toResponse(saved);
    }

    public TrainingPlanResponseDTO findByUserId(Long userId) {
        TrainingPlan plan = trainingPlanRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Plano não encontrado para o usuário"));
        return toResponse(plan);
    }

    @Transactional
    public void deleteByUserId(Long userId) {
        TrainingPlan plan = trainingPlanRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Plano não encontrado"));
        trainingPlanRepository.delete(plan);
    }

    private TrainingPlanResponseDTO toResponse(TrainingPlan plan) {
        List<TrainingDayResponseDTO> days = plan.getTrainingDays().stream()
                .map(day -> new TrainingDayResponseDTO(
                        day.getId(),
                        day.getDayOfWeek(),
                        day.getTrainingDayEntries().stream()
                                .map(entry -> new TrainingDayEntryResponseDTO(
                                        entry.getId(),
                                        entry.getWorkoutType(),
                                        entry.getMuscleGroups()
                                ))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());

        return new TrainingPlanResponseDTO(plan.getId(), plan.getUser().getId(), days);
    }
}
