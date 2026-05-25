package br.com.senai.mylibrary.loan;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.senai.mylibrary.loan.dto.LoanCreateRequest;
import br.com.senai.mylibrary.loan.dto.LoanResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(originPatterns = { "http://localhost:*", "http://127.0.0.1:*" })
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @GetMapping
    public ResponseEntity<List<LoanResponse>> listAll() {
        return ResponseEntity.ok(loanService.listAll());
    }

    @GetMapping("/active")
    public ResponseEntity<List<LoanResponse>> listActive() {
        return ResponseEntity.ok(loanService.listActive());
    }

    @PostMapping
    public ResponseEntity<LoanResponse> borrow(@Valid @RequestBody LoanCreateRequest request) {
        LoanResponse response = loanService.borrow(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<LoanResponse> returnLoan(@PathVariable Long id) {
        return ResponseEntity.ok(loanService.returnLoan(id));
    }
}
