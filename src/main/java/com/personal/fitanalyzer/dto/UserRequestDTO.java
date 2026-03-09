package com.personal.fitanalyzer.dto;
import com.personal.fitanalyzer.domain.enums.Goal;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UserRequestDTO(
        @NotBlank(message = "O nome é obrigatório")
        String name,
        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "E-mail inválido")
        String email,
        String password,
        String password_confirmation,
        @NotNull(message = "A altura é obrigatória")
        Float height,
        @NotNull(message = "O peso é obrigatório")
        Float weight,
        @NotNull(message = "A idade é obrigatória")
        LocalDate dateOfBirth,
        @NotBlank(message = "O genero é obrigatório")
        String gender,
        @NotNull(message="O objetivo é obrigatório")
        Goal goal
) {}