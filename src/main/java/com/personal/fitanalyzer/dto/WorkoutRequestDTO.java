package com.personal.fitanalyzer.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record WorkoutRequestDTO(
        @NotNull(message = "O nível de esforço é obrigatório.")
        Integer effort,
        @NotNull(message = "A data é obrigatória")
        LocalDateTime date,
        @NotNull(message = "O usuário é obrigatório")
        Long userId
) {}