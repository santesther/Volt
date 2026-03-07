package com.personal.fitanalyzer.dto;

import com.personal.fitanalyzer.domain.MuscleGroups;
import com.personal.fitanalyzer.domain.enums.Equipment;

import java.time.LocalDateTime;
import java.util.List;

public record StrengthWorkoutResponseDTO(
        Long id,
        Integer effort,
        LocalDateTime date,
        Integer durationMinutes,
        Equipment equipment,
        List<WorkoutSetResponseDTO> sets,
        List<MuscleGroups> muscles
) {}