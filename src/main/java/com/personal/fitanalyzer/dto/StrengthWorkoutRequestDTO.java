package com.personal.fitanalyzer.dto;

import com.personal.fitanalyzer.domain.enums.Equipment;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public record StrengthWorkoutRequestDTO (
        @NotNull(message="O número de séries é obrigatório")
        Integer sets,
        @NotNull(message="O tempo de duração é obrigatório")
        Integer durationMinutes,
        @NotNull(message = "O nível de esforço é obrigatório.")
        Integer effort,
        @NotNull(message = "A data é obrigatória")
        LocalDateTime date,
        @NotNull(message = "O usuário é obrigatório")
        Long userId,
        @NotNull(message="O tipo de equipamento é obrigatório")
        Equipment equipment,
        @NotNull(message="Os músculos treinados são obrigatórios")
        List<Long> muscleGroupsIds
) {}