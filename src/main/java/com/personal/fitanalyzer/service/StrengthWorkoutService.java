package com.personal.fitanalyzer.service;

import com.personal.fitanalyzer.domain.Exercise;
import com.personal.fitanalyzer.domain.MuscleGroups;
import com.personal.fitanalyzer.domain.StrengthWorkout;
import com.personal.fitanalyzer.domain.User;
import com.personal.fitanalyzer.domain.WorkoutSet;
import com.personal.fitanalyzer.dto.ExerciseResponseDTO;
import com.personal.fitanalyzer.dto.StrengthWorkoutRequestDTO;
import com.personal.fitanalyzer.dto.StrengthWorkoutResponseDTO;
import com.personal.fitanalyzer.dto.WorkoutSetRequestDTO;
import com.personal.fitanalyzer.dto.WorkoutSetResponseDTO;
import com.personal.fitanalyzer.exception.ResourceNotFoundException;
import com.personal.fitanalyzer.repository.ExerciseRepository;
import com.personal.fitanalyzer.repository.StrengthWorkoutRepository;
import com.personal.fitanalyzer.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StrengthWorkoutService {

    private final StrengthWorkoutRepository strengthWorkoutRepository;
    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;

    @Transactional
    public StrengthWorkoutResponseDTO createStrengthWorkout(StrengthWorkoutRequestDTO request) {
        StrengthWorkout workout = toEntity(request);
        StrengthWorkout saved = strengthWorkoutRepository.save(workout);
        return toResponse(saved);
    }

    public List<StrengthWorkoutResponseDTO> findAllStrengthWorkouts() {
        return strengthWorkoutRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public StrengthWorkout findStrengthWorkoutById(Long id) {
        return strengthWorkoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Treino não encontrado"));
    }

    public List<StrengthWorkout> findStrengthWorkoutByUserId(Long userId) {
        return strengthWorkoutRepository.findByUserId(userId);
    }

    @Transactional
    public StrengthWorkoutResponseDTO updateStrengthWorkout(Long id, StrengthWorkoutRequestDTO request) {
        StrengthWorkout workout = findStrengthWorkoutById(id);
        workout.setEffort(request.effort());
        workout.setDate(request.date());
        workout.setDurationMinutes(request.durationMinutes());
        workout.setEquipmentType(request.equipment());

        workout.getSets().clear();
        List<WorkoutSet> newSets = buildSets(request.sets(), workout);
        workout.getSets().addAll(newSets);

        workout.setMuscles(deriveMuscles(newSets));

        StrengthWorkout saved = strengthWorkoutRepository.save(workout);
        return toResponse(saved);
    }

    @Transactional
    public void deleteStrengthWorkout(Long id) {
        if (!strengthWorkoutRepository.existsById(id)) {
            throw new ResourceNotFoundException("Treino não encontrado");
        }
        strengthWorkoutRepository.deleteById(id);
    }

    private StrengthWorkout toEntity(StrengthWorkoutRequestDTO dto) {
        User user = userRepository.findById(dto.userId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        StrengthWorkout workout = new StrengthWorkout();
        workout.setEffort(dto.effort());
        workout.setDate(dto.date());
        workout.setUser(user);
        workout.setDurationMinutes(dto.durationMinutes());
        workout.setEquipmentType(dto.equipment());

        List<WorkoutSet> sets = buildSets(dto.sets(), workout);
        workout.setSets(sets);
        workout.setMuscles(deriveMuscles(sets));

        return workout;
    }

    private List<WorkoutSet> buildSets(List<WorkoutSetRequestDTO> dtos, StrengthWorkout workout) {
        return dtos.stream().map(dto -> {
            Exercise exercise = exerciseRepository.findById(dto.exerciseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Exercício não encontrado"));
            WorkoutSet set = new WorkoutSet();
            set.setExercise(exercise);
            set.setReps(dto.reps());
            set.setWeightKg(dto.weightKg());
            set.setOrder(dto.order());
            set.setStrengthWorkout(workout);
            return set;
        }).collect(Collectors.toList());
    }

    private List<MuscleGroups> deriveMuscles(List<WorkoutSet> sets) {
        return sets.stream()
                .map(s -> s.getExercise().getMuscleGroup())
                .distinct()
                .collect(Collectors.toList());
    }

    public StrengthWorkoutResponseDTO toResponse(StrengthWorkout w) {
        List<WorkoutSetResponseDTO> setsDTO = w.getSets().stream()
                .map(s -> new WorkoutSetResponseDTO(
                        s.getId(),
                        new ExerciseResponseDTO(s.getExercise().getId(), s.getExercise().getName(), s.getExercise().getMuscleGroup(), s.getExercise().getEquipment()),
                        s.getReps(),
                        s.getWeightKg(),
                        s.getOrder()
                ))
                .collect(Collectors.toList());

        return new StrengthWorkoutResponseDTO(
                w.getId(), w.getEffort(), w.getDate(),
                w.getDurationMinutes(), w.getEquipmentType(),
                setsDTO, w.getMuscles()
        );
    }
}
