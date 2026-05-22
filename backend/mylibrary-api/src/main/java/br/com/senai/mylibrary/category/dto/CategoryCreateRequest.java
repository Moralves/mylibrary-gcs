package br.com.senai.mylibrary.category.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryCreateRequest(
    @NotBlank(message = "O nome é obrigatório.")
    String name,
    String description
) {
}
