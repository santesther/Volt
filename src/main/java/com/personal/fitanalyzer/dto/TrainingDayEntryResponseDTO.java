package com.personal.fitanalyzer.dto;

import com.personal.fitanalyzer.domain.MuscleGroups;
import com.personal.fitanalyzer.domain.enums.WorkoutType;

import java.util.List;

public record TrainingDayEntryResponseDTO(
        Long id,
        WorkoutType workoutType,
        List<MuscleGroups> muscleGroups
) {}