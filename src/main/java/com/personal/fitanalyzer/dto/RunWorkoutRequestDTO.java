package com.personal.fitanalyzer.dto;

import com.personal.fitanalyzer.domain.enums.Equipment;
import com.personal.fitanalyzer.domain.enums.Weather;
import com.personal.fitanalyzer.domain.enums.Zone;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public record RunWorkoutRequestDTO (
        @NotNull(message = "O nível de esforço é obrigatório.")
        Integer effort,
        @NotNull(message = "A data é obrigatória")
        LocalDateTime date,
        @NotNull(message="A distância é obrigatória")
        Float km,
        @NotNull(message="A duração é obrigatória")
        Float duration,
        @NotNull(message="A zona de esforço é obrigatória")
        Zone zone,
        @NotNull(message="A subida é obrigatória")
        Integer uphill,
        @NotNull(message="A descida é obrigatória")
        Integer downhill,
        @NotNull(message="O clina é obrigatório")
        Weather weather,
        @NotNull(message = "O usuário é obrigatório")
        Long userId,
        List<Long> painfulMuscleIds
) {}