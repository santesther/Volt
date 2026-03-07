package com.personal.fitanalyzer.dto;

public record WorkoutSetResponseDTO(
        Long id,
        ExerciseResponseDTO exercise,
        Integer reps,
        Float weightKg,
        Integer order
) {}