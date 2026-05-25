package br.com.senai.mylibrary.category.dto;

public record CategoryResponse(
    Long id,
    String name,
    String description,
    long bookCount
) {
}
