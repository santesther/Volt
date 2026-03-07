package com.personal.fitanalyzer.dto;

import java.time.LocalDateTime;

public record WorkoutResponseDTO(
        Long id,
        Integer effort,
        LocalDateTime date
) {}