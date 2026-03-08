package com.personal.fitanalyzer.dto;

import jakarta.validation.constraints.NotNull;

import java.time.DayOfWeek;
import java.util.List;

public record TrainingDayRequestDTO(
        @NotNull DayOfWeek dayOfWeek,
        @NotNull List<TrainingDayEntryRequestDTO> entries
) {}