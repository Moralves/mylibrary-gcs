import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, finalize, timeout, TimeoutError } from 'rxjs';
import { Book } from '../../../core/models/book.model';
import { Loan } from '../../../core/models/loan.model';
import { BookService } from '../../../core/services/book.service';
import { LoanBorrowPayload, LoanService } from '../../../core/services/loan.service';
import { LoanFormComponent } from '../loan-form/loan-form.component';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, LoanFormComponent],
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.css']
})
export class LoanListComponent implements OnInit {
  @ViewChild(LoanFormComponent) private formComponent?: LoanFormComponent;

  private readonly alertSubject = new BehaviorSubject<AlertState | null>(null);
  private readonly today = this.getCurrentDateForCompare();

  public availableBooks: Book[] = [];
  public activeLoans: Loan[] = [];
  public loans: Loan[] = [];
  public isLoadingBooks = false;
  public isLoadingActiveLoans = false;
  public isLoadingLoans = false;
  public isSubmitting = false;
  public returningId: number | null = null;
  public readonly alert$ = this.alertSubject.asObservable();

  public constructor(
    private readonly bookService: BookService,
    private readonly loanService: LoanService
  ) {}

  public ngOnInit(): void {
    this.loadAvailableBooks();
    this.loadActiveLoans();
    this.loadLoans();
  }

  public onSubmitLoan(payload: LoanBorrowPayload): void {
    this.isSubmitting = true;
    this.clearAlert();

    this.loanService
      .borrowBook(payload)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: (loan) => {
          if (!loan || !loan.id) {
            this.showError('Resposta invalida ao registrar emprestimo.');
            return;
          }

          this.formComponent?.resetForm();
          this.showSuccess('Emprestimo registrado com sucesso.');
          this.loadAvailableBooks();
          this.loadActiveLoans();
          this.loadLoans();
        },
        error: (error) => {
          this.showError(this.getErrorMessage(error, 'Nao foi possivel registrar o emprestimo.'));
        }
      });
  }

  public onReturnLoan(loan: Loan): void {
    if (!loan.active) {
      return;
    }

    const confirmed = window.confirm(
      `Confirmar devolucao do livro "${loan.bookTitle}" emprestado para ${loan.personName}?`
    );
    if (!confirmed) {
      return;
    }

    this.returningId = loan.id;
    this.clearAlert();

    this.loanService
      .returnLoan(loan.id)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.returningId = null;
        })
      )
      .subscribe({
        next: () => {
          this.showSuccess('Devolucao registrada com sucesso.');
          this.loadAvailableBooks();
          this.loadActiveLoans();
          this.loadLoans();
        },
        error: (error) => {
          this.showError(this.getErrorMessage(error, 'Nao foi possivel registrar a devolucao.'));
        }
      });
  }

  public isReturnDisabled(loan: Loan): boolean {
    return this.returningId === loan.id || !loan.active;
  }

  public getReturnButtonLabel(loan: Loan): string {
    return this.returningId === loan.id ? 'Registrando...' : 'Registrar devolucao';
  }

  public isLoanOverdue(loan: Loan): boolean {
    return loan.active && loan.expectedReturnDate < this.today;
  }

  private loadAvailableBooks(): void {
    this.isLoadingBooks = true;

    this.bookService
      .listBooks({ status: 'AVAILABLE' })
      .pipe(
        timeout(10000),
        finalize(() => {
          this.isLoadingBooks = false;
        })
      )
      .subscribe({
        next: (books) => {
          const safeBooks = Array.isArray(books) ? books : [];
          this.availableBooks = this.sortBooks(safeBooks);
        },
        error: (error) => {
          this.showError(
            this.getErrorMessage(error, 'Nao foi possivel carregar os livros disponiveis para emprestimo.')
          );
        }
      });
  }

  private loadActiveLoans(): void {
    this.isLoadingActiveLoans = true;

    this.loanService
      .listActiveLoans()
      .pipe(
        timeout(10000),
        finalize(() => {
          this.isLoadingActiveLoans = false;
        })
      )
      .subscribe({
        next: (loans) => {
          const safeLoans = Array.isArray(loans) ? loans : [];
          this.activeLoans = this.sortActiveLoans(safeLoans);
        },
        error: (error) => {
          this.showError(this.getErrorMessage(error, 'Nao foi possivel carregar os emprestimos ativos.'));
        }
      });
  }

  private loadLoans(): void {
    this.isLoadingLoans = true;

    this.loanService
      .listLoans()
      .pipe(
        timeout(10000),
        finalize(() => {
          this.isLoadingLoans = false;
        })
      )
      .subscribe({
        next: (loans) => {
          const safeLoans = Array.isArray(loans) ? loans : [];
          this.loans = this.sortLoansByMostRecent(safeLoans);
        },
        error: (error) => {
          this.showError(this.getErrorMessage(error, 'Nao foi possivel carregar o historico de emprestimos.'));
        }
      });
  }

  private sortBooks(books: Book[]): Book[] {
    return [...books].sort((a, b) => a.title.localeCompare(b.title));
  }

  private sortActiveLoans(loans: Loan[]): Loan[] {
    return [...loans].sort((a, b) => {
      if (a.expectedReturnDate === b.expectedReturnDate) {
        if (a.loanDate === b.loanDate) {
          return a.id - b.id;
        }
        return a.loanDate.localeCompare(b.loanDate);
      }
      return a.expectedReturnDate.localeCompare(b.expectedReturnDate);
    });
  }

  private sortLoansByMostRecent(loans: Loan[]): Loan[] {
    return [...loans].sort((a, b) => {
      if (a.loanDate === b.loanDate) {
        return b.id - a.id;
      }
      return b.loanDate.localeCompare(a.loanDate);
    });
  }

  private showSuccess(message: string): void {
    this.alertSubject.next({ type: 'success', message });
  }

  private showError(message: string): void {
    this.alertSubject.next({ type: 'error', message });
  }

  private clearAlert(): void {
    this.alertSubject.next(null);
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof TimeoutError) {
      return 'A requisicao demorou mais que o esperado. Tente novamente.';
    }

    const typedError = error as { error?: { message?: string } };
    return typedError?.error?.message ?? fallback;
  }

  private getCurrentDateForCompare(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

type AlertState = {
  type: 'success' | 'error';
  message: string;
};
