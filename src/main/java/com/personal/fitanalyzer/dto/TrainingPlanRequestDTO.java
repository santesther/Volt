package com.personal.fitanalyzer.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record TrainingPlanRequestDTO(
        @NotNull Long userId,
        @NotNull List<TrainingDayRequestDTO> days
) {}