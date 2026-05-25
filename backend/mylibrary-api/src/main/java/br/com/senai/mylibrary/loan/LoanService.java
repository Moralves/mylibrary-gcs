package br.com.senai.mylibrary.loan;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.senai.mylibrary.book.Book;
import br.com.senai.mylibrary.book.BookRepository;
import br.com.senai.mylibrary.book.BookStatus;
import br.com.senai.mylibrary.loan.dto.LoanCreateRequest;
import br.com.senai.mylibrary.loan.dto.LoanResponse;
import br.com.senai.mylibrary.shared.exception.BusinessException;
import br.com.senai.mylibrary.shared.exception.ResourceNotFoundException;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final BookRepository bookRepository;

    public LoanService(LoanRepository loanRepository, BookRepository bookRepository) {
        this.loanRepository = loanRepository;
        this.bookRepository = bookRepository;
    }

    @Transactional(readOnly = true)
    public List<LoanResponse> listAll() {
        return loanRepository.findAllWithBook()
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<LoanResponse> listActive() {
        return loanRepository.findActiveWithBook()
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<LoanResponse> listByBookId(Long bookId) {
        resolveBook(bookId);

        return loanRepository.findByBookIdWithBook(bookId)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional
    public LoanResponse borrow(LoanCreateRequest request) {
        if (request == null) {
            throw new BusinessException("Os dados do emprestimo sao obrigatorios.", HttpStatus.BAD_REQUEST);
        }

        Book book = resolveBook(request.bookId());
        validateBookIsAvailable(book);
        validateNoActiveLoan(book.getId());

        LocalDate loanDate = LocalDate.now();
        LocalDate expectedReturnDate = normalizeExpectedReturnDate(request.expectedReturnDate(), loanDate);
        String personName = normalizeRequiredField(request.personName(), "O nome da pessoa e obrigatorio.");
        String personPhone = normalizeRequiredField(request.personPhone(), "O telefone da pessoa e obrigatorio.");

        Loan loan = new Loan();
        loan.setBook(book);
        loan.setPersonName(personName);
        loan.setPersonPhone(personPhone);
        loan.setLoanDate(loanDate);
        loan.setExpectedReturnDate(expectedReturnDate);
        loan.setActualReturnDate(null);

        book.setStatus(BookStatus.BORROWED);

        Loan saved = loanRepository.save(loan);
        return toResponse(saved);
    }

    @Transactional
    public LoanResponse returnLoan(Long loanId) {
        Loan loan = loanRepository.findByIdWithBook(loanId)
            .orElseThrow(() -> new ResourceNotFoundException("Emprestimo nao encontrado."));

        if (loan.getActualReturnDate() != null) {
            throw new BusinessException("Este emprestimo ja foi devolvido.", HttpStatus.CONFLICT);
        }

        Book book = loan.getBook();
        if (book.getStatus() != BookStatus.BORROWED) {
            throw new BusinessException("Nao e possivel devolver um livro disponivel.", HttpStatus.CONFLICT);
        }

        loan.setActualReturnDate(LocalDate.now());
        book.setStatus(BookStatus.AVAILABLE);

        Loan saved = loanRepository.save(loan);
        return toResponse(saved);
    }

    private Book resolveBook(Long bookId) {
        if (bookId == null) {
            throw new BusinessException("O livro e obrigatorio.", HttpStatus.BAD_REQUEST);
        }

        return bookRepository.findById(bookId)
            .orElseThrow(() -> new ResourceNotFoundException("Livro nao encontrado."));
    }

    private void validateBookIsAvailable(Book book) {
        if (book.getStatus() != BookStatus.AVAILABLE) {
            throw new BusinessException("Nao e possivel emprestar livro ja emprestado.", HttpStatus.CONFLICT);
        }
    }

    private void validateNoActiveLoan(Long bookId) {
        if (loanRepository.existsByBookIdAndActualReturnDateIsNull(bookId)) {
            throw new BusinessException("Este livro ja possui emprestimo ativo.", HttpStatus.CONFLICT);
        }
    }

    private String normalizeRequiredField(String value, String message) {
        String normalized = value == null ? "" : value.trim();
        if (normalized.isBlank()) {
            throw new BusinessException(message, HttpStatus.BAD_REQUEST);
        }
        return normalized;
    }

    private LocalDate normalizeExpectedReturnDate(LocalDate expectedReturnDate, LocalDate loanDate) {
        if (expectedReturnDate == null) {
            throw new BusinessException("A data prevista de devolucao e obrigatoria.", HttpStatus.BAD_REQUEST);
        }

        if (expectedReturnDate.isBefore(loanDate)) {
            throw new BusinessException(
                "A data prevista de devolucao nao pode ser anterior a data do emprestimo.",
                HttpStatus.BAD_REQUEST
            );
        }

        return expectedReturnDate;
    }

    private LoanResponse toResponse(Loan loan) {
        Book book = loan.getBook();
        BookStatus status = book.getStatus();
        LocalDate actualReturnDate = loan.getActualReturnDate();

        return new LoanResponse(
            loan.getId(),
            book.getId(),
            book.getTitle(),
            status.name(),
            status.getDisplayName(),
            loan.getPersonName(),
            loan.getPersonPhone(),
            loan.getLoanDate(),
            loan.getExpectedReturnDate(),
            actualReturnDate,
            actualReturnDate == null
        );
    }
}
