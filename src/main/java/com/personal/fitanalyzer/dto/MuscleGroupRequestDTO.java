package com.personal.fitanalyzer.dto;

import com.personal.fitanalyzer.domain.enums.Size;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;


public record MuscleGroupRequestDTO (
        @NotBlank(message="O nome é obrigatório")
        String name,
        @NotNull(message="O tempo de recuperação é obrigatório")
        Float recoveryHours,
        @NotNull(message = "O tamanho do músculo é obrigatório.")
        Size size,
        Long antagonistId
) {}