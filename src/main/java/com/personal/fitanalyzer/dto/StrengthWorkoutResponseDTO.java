package com.personal.fitanalyzer.dto;

import com.personal.fitanalyzer.domain.MuscleGroups;
import com.personal.fitanalyzer.domain.enums.Equipment;

import java.time.LocalDateTime;
import java.util.List;

public record StrengthWorkoutResponseDTO(
        Long id,
        Integer effort,
        LocalDateTime date,
        Integer sets,
        Integer durationMinutes,
        Equipment equipment,
        List<MuscleGroups> musclesGroupsIds)
{}