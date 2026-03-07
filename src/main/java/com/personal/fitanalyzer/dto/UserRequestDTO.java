package com.personal.fitanalyzer.dto;
import com.personal.fitanalyzer.domain.enums.Goal;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserRequestDTO(
        @NotBlank(message = "O nome é obrigatório")
        String name,
        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "E-mail inválido")
        String email,
        @NotBlank(message = "A senha é obrigatória")
        @Size(min=8, message= "A senha deve ter pelo menos 8 caracteres")
        String password,
        @NotBlank(message = "A senha é obrigatória")
        @Size(min=8, message= "A confirmação da sua senha deve ser igual a senha")
        String password_confirmation,
        @NotNull(message = "A altura é obrigatória")
        Float height,
        @NotNull(message = "O peso é obrigatório")
        Float weight,
        @NotNull(message = "A idade é obrigatória")
        Integer age,
        @NotBlank(message = "O genero é obrigatório")
        String gender,
        @NotNull(message="O objetivo é obrigatório")
        Goal goal
) {}