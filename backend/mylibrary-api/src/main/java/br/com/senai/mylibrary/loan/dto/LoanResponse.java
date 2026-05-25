package br.com.senai.mylibrary.loan.dto;

import java.time.LocalDate;

public record LoanResponse(
    Long id,
    Long bookId,
    String bookTitle,
    String bookStatus,
    String bookStatusLabel,
    String personName,
    String personPhone,
    LocalDate loanDate,
    LocalDate expectedReturnDate,
    LocalDate actualReturnDate,
    boolean active
) {
}
