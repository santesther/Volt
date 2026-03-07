package com.personal.fitanalyzer.dto;

import com.personal.fitanalyzer.domain.enums.Equipment;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public record StrengthWorkoutRequestDTO(
        @NotNull(message = "O esforço é obrigatório")
        Integer effort,
        @NotNull(message = "A data é obrigatória")
        LocalDateTime date,
        @NotNull(message = "O usuário é obrigatório")
        Long userId,
        @NotNull(message = "A duração é obrigatória")
        Integer durationMinutes,
        Equipment equipment,
        @NotNull(message = "As séries são obrigatórias")
        List<WorkoutSetRequestDTO> sets
) {}