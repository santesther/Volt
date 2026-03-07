package com.personal.fitanalyzer.dto;

import java.util.List;

public record SuggestionRequestDTO(
        List<Long> painfulMuscleIds
) {}