package br.com.senai.mylibrary.loan.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LoanCreateRequest(
    @NotNull(message = "O livro e obrigatorio.")
    Long bookId,
    @NotBlank(message = "O nome da pessoa e obrigatorio.")
    String personName,
    @NotBlank(message = "O telefone da pessoa e obrigatorio.")
    String personPhone,
    @NotNull(message = "A data prevista de devolucao e obrigatoria.")
    LocalDate expectedReturnDate
) {
}
