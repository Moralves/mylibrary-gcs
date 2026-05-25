package br.com.senai.mylibrary.book.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BookCreateRequest(
    @NotBlank(message = "O título é obrigatório.")
    String title,
    @NotBlank(message = "O autor é obrigatório.")
    String author,
    String isbn,
    Integer publicationYear,
    @NotNull(message = "A categoria é obrigatória.")
    Long categoryId
) {
}
