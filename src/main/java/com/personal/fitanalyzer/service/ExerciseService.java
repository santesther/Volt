package com.personal.fitanalyzer.service;

import com.personal.fitanalyzer.domain.Exercise;
import com.personal.fitanalyzer.domain.MuscleGroups;
import com.personal.fitanalyzer.dto.ExerciseRequestDTO;
import com.personal.fitanalyzer.dto.ExerciseResponseDTO;
import com.personal.fitanalyzer.exception.ResourceNotFoundException;
import com.personal.fitanalyzer.repository.ExerciseRepository;
import com.personal.fitanalyzer.repository.MuscleGroupRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final MuscleGroupRepository muscleGroupRepository;

    @Transactional
    public ExerciseResponseDTO createExercise(ExerciseRequestDTO request) {
        MuscleGroups muscleGroup = muscleGroupRepository.findById(request.muscleGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("Grupo muscular não encontrado"));

        Exercise exercise = new Exercise();
        exercise.setName(request.name());
        exercise.setMuscleGroup(muscleGroup);
        exercise.setEquipment(request.equipment());

        Exercise saved = exerciseRepository.save(exercise);
        return toResponse(saved);
    }

    public List<ExerciseResponseDTO> findAllExercises() {
        return exerciseRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ExerciseResponseDTO> findByMuscleGroupId(Long muscleGroupId) {
        return exerciseRepository.findByMuscleGroupId(muscleGroupId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ExerciseResponseDTO findExerciseById(Long id) {
        return toResponse(exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercício não encontrado")));
    }

    @Transactional
    public ExerciseResponseDTO updateExercise(Long id, ExerciseRequestDTO request) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercício não encontrado"));

        MuscleGroups muscleGroup = muscleGroupRepository.findById(request.muscleGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("Grupo muscular não encontrado"));

        exercise.setName(request.name());
        exercise.setMuscleGroup(muscleGroup);
        exercise.setEquipment(request.equipment());

        return toResponse(exerciseRepository.save(exercise));
    }

    @Transactional
    public void deleteExercise(Long id) {
        if (!exerciseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Exercício não encontrado");
        }
        exerciseRepository.deleteById(id);
    }

    private ExerciseResponseDTO toResponse(Exercise e) {
        return new ExerciseResponseDTO(e.getId(), e.getName(), e.getMuscleGroup(), e.getEquipment());
    }
}