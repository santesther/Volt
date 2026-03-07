package com.personal.fitanalyzer.dto;

import com.personal.fitanalyzer.domain.enums.Goal;

import java.time.LocalDate;

public record UserResponseDTO(
        Long id,
        String name,
        String email,
        Float height,
        Float weight,
        LocalDate dateOfBirth,
        Integer age,
        String gender,
        Goal goal
) {}