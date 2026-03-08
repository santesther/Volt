package com.personal.fitanalyzer.dto;

import java.util.List;

public record TrainingPlanResponseDTO(
        Long id,
        Long userId,
        List<TrainingDayResponseDTO> days
) {}