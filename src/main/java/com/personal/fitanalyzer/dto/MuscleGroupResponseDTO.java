package com.personal.fitanalyzer.dto;

import com.personal.fitanalyzer.domain.MuscleGroups;
import com.personal.fitanalyzer.domain.enums.Size;


public record MuscleGroupResponseDTO(
        Long id,
        String name,
        Float recoveryHours,
        Size size,
        MuscleGroups antagonist)
{}