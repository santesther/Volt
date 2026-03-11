package com.personal.fitanalyzer.dto;

import com.personal.fitanalyzer.domain.enums.Equipment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ExerciseRequestDTO(
        @NotBlank(message = "O nome é obrigatório")
        String name,
        @NotNull(message = "O grupo muscular é obrigatório")
        Long muscleGroupId,
        Equipment equipment,
        String nameEn
) {}