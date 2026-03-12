package com.personal.fitanalyzer.dto;

import java.util.List;

public record WorkoutPainRequestDTO(
        List<PainEntryDTO> entries
) {
    public record PainEntryDTO(Long muscleGroupId, Integer painIntensity) {}
}