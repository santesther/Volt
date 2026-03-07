package com.personal.fitanalyzer.dto;

import com.personal.fitanalyzer.domain.enums.Goal;

public record UserResponseDTO(
        Long id,
        String name,
        String email,
        Float height,
        Float weight,
        Integer age,
        String gender,
        Goal goal
) {}