package com.personal.fitanalyzer.dto;

import com.personal.fitanalyzer.domain.MuscleGroups;
import com.personal.fitanalyzer.domain.enums.Equipment;

public record ExerciseResponseDTO(
        Long id,
        String name,
        MuscleGroups muscleGroup,
        Equipment equipment
) {}