package br.com.senai.mylibrary.book.dto;

public record BookResponse(
    Long id,
    String title,
    String author,
    String isbn,
    Integer publicationYear,
    String status,
    String statusLabel,
    Long categoryId,
    String categoryName
) {
}
