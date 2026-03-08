package com.personal.fitanalyzer.dto;

import java.time.DayOfWeek;
import java.util.List;

public record TrainingDayResponseDTO(
        Long id,
        DayOfWeek dayOfWeek,
        List<TrainingDayEntryResponseDTO> entries
) {}
