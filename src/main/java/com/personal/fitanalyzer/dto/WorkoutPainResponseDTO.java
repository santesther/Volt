package com.personal.fitanalyzer.dto;

public record WorkoutPainResponseDTO(
        Long id,
        Long muscleGroupId,
        String muscleGroupName,
        Integer painIntensity
) {}