package br.com.senai.mylibrary.book;

public enum BookStatus {
    AVAILABLE("Disponível"),
    BORROWED("Emprestado");

    private final String displayName;

    BookStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
