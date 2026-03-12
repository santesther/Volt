package com.personal.fitanalyzer.service;

import com.personal.fitanalyzer.domain.MuscleGroups;
import com.personal.fitanalyzer.domain.Workout;
import com.personal.fitanalyzer.domain.WorkoutPainEntry;
import com.personal.fitanalyzer.dto.WorkoutPainRequestDTO;
import com.personal.fitanalyzer.dto.WorkoutPainResponseDTO;
import com.personal.fitanalyzer.exception.ResourceNotFoundException;
import com.personal.fitanalyzer.repository.MuscleGroupRepository;
import com.personal.fitanalyzer.repository.WorkoutPainEntryRepository;
import com.personal.fitanalyzer.repository.WorkoutRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutPainService {

    private final WorkoutPainEntryRepository painEntryRepository;
    private final WorkoutRepository workoutRepository;
    private final MuscleGroupRepository muscleGroupRepository;

    @Transactional
    public void savePain(Long workoutId, WorkoutPainRequestDTO request) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new ResourceNotFoundException("Treino não encontrado: " + workoutId));

        painEntryRepository.deleteByWorkoutId(workoutId);

        if (request.entries() == null || request.entries().isEmpty()) return;

        List<WorkoutPainEntry> entries = request.entries().stream()
                .filter(e -> e.painIntensity() != null && e.painIntensity() > 0)
                .map(e -> {
                    MuscleGroups muscle = muscleGroupRepository.findById(e.muscleGroupId())
                            .orElseThrow(() -> new ResourceNotFoundException("Músculo não encontrado: " + e.muscleGroupId()));
                    return new WorkoutPainEntry(workout, muscle, e.painIntensity());
                })
                .toList();

        painEntryRepository.saveAll(entries);
    }

    public List<WorkoutPainResponseDTO> getPainByWorkout(Long workoutId) {
        return painEntryRepository.findByWorkoutId(workoutId).stream()
                .map(e -> new WorkoutPainResponseDTO(
                        e.getId(),
                        e.getMuscleGroup().getId(),
                        e.getMuscleGroup().getName(),
                        e.getPainIntensity()
                ))
                .toList();
    }
}