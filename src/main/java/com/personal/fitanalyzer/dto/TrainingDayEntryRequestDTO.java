package com.personal.fitanalyzer.dto;

import com.personal.fitanalyzer.domain.enums.RunType;
import com.personal.fitanalyzer.domain.enums.WorkoutType;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record TrainingDayEntryRequestDTO(
        @NotNull WorkoutType workoutType,
        List<Long> muscleGroupIds,
        Double targetKm,
        RunType runType
) {}