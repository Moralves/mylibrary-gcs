package br.com.senai.mylibrary.book;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.senai.mylibrary.book.dto.BookCreateRequest;
import br.com.senai.mylibrary.book.dto.BookResponse;
import br.com.senai.mylibrary.loan.LoanService;
import br.com.senai.mylibrary.loan.dto.LoanResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(originPatterns = { "http://localhost:*", "http://127.0.0.1:*" })
public class BookController {

    private final BookService bookService;
    private final LoanService loanService;

    public BookController(BookService bookService, LoanService loanService) {
        this.bookService = bookService;
        this.loanService = loanService;
    }

    @GetMapping
    public ResponseEntity<List<BookResponse>> listAll(
        @RequestParam(required = false) Long categoryId,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(bookService.listAll(categoryId, status, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.findById(id));
    }

    @GetMapping("/{bookId}/loans")
    public ResponseEntity<List<LoanResponse>> listLoansByBook(@PathVariable Long bookId) {
        return ResponseEntity.ok(loanService.listByBookId(bookId));
    }

    @PostMapping
    public ResponseEntity<BookResponse> create(@Valid @RequestBody BookCreateRequest request) {
        BookResponse response = bookService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
