package br.com.senai.mylibrary.book;

import java.time.Year;
import java.util.List;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.senai.mylibrary.book.dto.BookCreateRequest;
import br.com.senai.mylibrary.book.dto.BookResponse;
import br.com.senai.mylibrary.category.Category;
import br.com.senai.mylibrary.category.CategoryRepository;
import br.com.senai.mylibrary.shared.exception.BusinessException;
import br.com.senai.mylibrary.shared.exception.ResourceNotFoundException;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public BookService(BookRepository bookRepository, CategoryRepository categoryRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<BookResponse> listAll(Long categoryId, String status, String search) {
        BookStatus parsedStatus = parseStatus(status);
        String normalizedSearch = normalizeSearch(search);

        return bookRepository.findAllByFilters(categoryId, parsedStatus, normalizedSearch)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public BookResponse findById(Long id) {
        Book book = bookRepository.findByIdWithCategory(id)
            .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado."));

        return toResponse(book);
    }

    @Transactional
    public BookResponse create(BookCreateRequest request) {
        if (request == null) {
            throw new BusinessException("Os dados do livro são obrigatórios.", HttpStatus.BAD_REQUEST);
        }

        String normalizedTitle = normalizeRequiredField(request.title(), "O título é obrigatório.");
        String normalizedAuthor = normalizeRequiredField(request.author(), "O autor é obrigatório.");
        Integer publicationYear = normalizePublicationYear(request.publicationYear());
        Category category = resolveCategory(request.categoryId());

        Book book = new Book();
        book.setTitle(normalizedTitle);
        book.setAuthor(normalizedAuthor);
        book.setIsbn(normalizeOptionalField(request.isbn()));
        book.setPublicationYear(publicationYear);
        book.setStatus(BookStatus.AVAILABLE);
        book.setCategory(category);

        Book saved = bookRepository.save(book);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado."));

        if (book.getStatus() == BookStatus.BORROWED) {
            throw new BusinessException("Não é possível excluir livros emprestados.", HttpStatus.CONFLICT);
        }

        bookRepository.delete(book);
    }

    public boolean hasLinkedBooks(Long categoryId) {
        return bookRepository.existsByCategoryId(categoryId);
    }

    public long countByCategoryId(Long categoryId) {
        return bookRepository.countByCategoryId(categoryId);
    }

    private Category resolveCategory(Long categoryId) {
        if (categoryId == null) {
            throw new BusinessException("A categoria é obrigatória.", HttpStatus.BAD_REQUEST);
        }

        return categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));
    }

    private String normalizeRequiredField(String value, String message) {
        String normalized = value == null ? "" : value.trim();
        if (normalized.isBlank()) {
            throw new BusinessException(message, HttpStatus.BAD_REQUEST);
        }
        return normalized;
    }

    private String normalizeOptionalField(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();
        return normalized.isBlank() ? null : normalized;
    }

    private Integer normalizePublicationYear(Integer publicationYear) {
        if (publicationYear == null) {
            return null;
        }

        int currentYear = Year.now().getValue();
        if (publicationYear > currentYear) {
            throw new BusinessException(
                "O ano de publicação não pode ser maior que o ano atual.",
                HttpStatus.BAD_REQUEST
            );
        }

        return publicationYear;
    }

    private String normalizeSearch(String search) {
        if (search == null) {
            return null;
        }

        String normalized = search.trim();
        return normalized.isBlank() ? null : normalized;
    }

    private BookStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }

        String normalizedStatus = status.trim().toUpperCase(Locale.ROOT);

        try {
            return BookStatus.valueOf(normalizedStatus);
        } catch (IllegalArgumentException ex) {
            throw new BusinessException("Status inválido. Use AVAILABLE ou BORROWED.", HttpStatus.BAD_REQUEST);
        }
    }

    private BookResponse toResponse(Book book) {
        BookStatus status = book.getStatus();
        return new BookResponse(
            book.getId(),
            book.getTitle(),
            book.getAuthor(),
            book.getIsbn(),
            book.getPublicationYear(),
            status.name(),
            status.getDisplayName(),
            book.getCategory().getId(),
            book.getCategory().getName()
        );
    }
}
