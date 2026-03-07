package com.personal.fitanalyzer.dto;

import jakarta.validation.constraints.NotNull;

public record WorkoutSetRequestDTO(
        @NotNull(message = "O exercício é obrigatório")
        Long exerciseId,
        @NotNull(message = "As repetições são obrigatórias")
        Integer reps,
        @NotNull(message = "O peso é obrigatório")
        Float weightKg,
        @NotNull(message = "A ordem é obrigatória")
        Integer order
) {}
