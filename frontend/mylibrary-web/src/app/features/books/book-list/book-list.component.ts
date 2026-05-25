import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, finalize, timeout, TimeoutError } from 'rxjs';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Category } from '../../../core/models/category.model';
import { Book, BookStatus } from '../../../core/models/book.model';
import { CategoryService } from '../../../core/services/category.service';
import {
  BookCreatePayload,
  BookFilterPayload,
  BookService
} from '../../../core/services/book.service';
import { BookFormComponent } from '../book-form/book-form.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BookFormComponent],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  @ViewChild(BookFormComponent) private formComponent?: BookFormComponent;

  private readonly alertSubject = new BehaviorSubject<AlertState | null>(null);

  public books: Book[] = [];
  public categories: Category[] = [];
  public isLoadingBooks = false;
  public isLoadingCategories = false;
  public isSubmitting = false;
  public deletingId: number | null = null;
  public readonly alert$ = this.alertSubject.asObservable();
  public readonly statusOptions: StatusOption[] = [
    { value: 'AVAILABLE', label: 'Disponível' },
    { value: 'BORROWED', label: 'Emprestado' }
  ];

  public readonly filtersForm;

  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly bookService: BookService,
    private readonly categoryService: CategoryService
  ) {
    this.filtersForm = this.formBuilder.group({
      categoryId: [''],
      status: [''],
      search: ['']
    });
  }

  public ngOnInit(): void {
    this.loadCategories();
    this.loadBooks();
  }

  public onSubmitBook(payload: BookCreatePayload): void {
    this.isSubmitting = true;
    this.clearAlert();

    this.bookService
      .createBook(payload)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: (book) => {
          if (!book || !book.id || !book.title) {
            this.showError('Resposta inválida ao cadastrar o livro.');
            return;
          }

          this.formComponent?.resetForm();
          this.showSuccess('Livro cadastrado com sucesso.');
          this.loadBooks();
          this.loadCategories();
        },
        error: (error) => {
          this.showError(this.getErrorMessage(error, 'Não foi possível cadastrar o livro.'));
        }
      });
  }

  public onApplyFilters(): void {
    this.loadBooks();
  }

  public onClearFilters(): void {
    this.filtersForm.reset({
      categoryId: '',
      status: '',
      search: ''
    });
    this.loadBooks();
  }

  public onDeleteBook(book: Book): void {
    if (book.status === 'BORROWED') {
      return;
    }

    const confirmed = window.confirm(`Tem certeza que deseja excluir o livro "${book.title}"?`);
    if (!confirmed) {
      return;
    }

    this.deletingId = book.id;
    this.clearAlert();

    this.bookService
      .deleteBook(book.id)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.deletingId = null;
        })
      )
      .subscribe({
        next: () => {
          this.showSuccess('Livro excluído com sucesso.');
          this.loadBooks();
          this.loadCategories();
        },
        error: (error) => {
          this.showError(this.getErrorMessage(error, 'Não foi possível excluir o livro.'));
        }
      });
  }

  public getDeleteButtonLabel(book: Book): string {
    if (this.deletingId === book.id) {
      return 'Excluindo...';
    }

    return book.status === 'BORROWED' ? 'Emprestado' : 'Excluir';
  }

  public isDeleteDisabled(book: Book): boolean {
    return this.deletingId === book.id || book.status === 'BORROWED';
  }

  private loadCategories(): void {
    this.isLoadingCategories = true;

    this.categoryService
      .listCategories()
      .pipe(
        timeout(10000),
        finalize(() => {
          this.isLoadingCategories = false;
        })
      )
      .subscribe({
        next: (categories) => {
          const safeCategories = Array.isArray(categories) ? categories : [];
          this.categories = this.sortCategories(safeCategories);
        },
        error: (error) => {
          this.showError(
            this.getErrorMessage(error, 'Não foi possível carregar as categorias para o cadastro.')
          );
        }
      });
  }

  private loadBooks(): void {
    this.isLoadingBooks = true;

    this.bookService
      .listBooks(this.buildFilters())
      .pipe(
        timeout(10000),
        finalize(() => {
          this.isLoadingBooks = false;
        })
      )
      .subscribe({
        next: (books) => {
          const safeBooks = Array.isArray(books) ? books : [];
          this.books = this.sortBooks(safeBooks);
        },
        error: (error) => {
          this.showError(this.getErrorMessage(error, 'Não foi possível carregar os livros.'));
        }
      });
  }

  private buildFilters(): BookFilterPayload {
    const rawCategoryId = this.filtersForm.value.categoryId;
    const rawStatus = this.filtersForm.value.status;
    const rawSearch = (this.filtersForm.value.search ?? '').toString().trim();

    const filters: BookFilterPayload = {};

    if (rawCategoryId !== null && rawCategoryId !== undefined && rawCategoryId !== '') {
      filters.categoryId = Number(rawCategoryId);
    }

    if (rawStatus === 'AVAILABLE' || rawStatus === 'BORROWED') {
      filters.status = rawStatus;
    }

    if (rawSearch.length > 0) {
      filters.search = rawSearch;
    }

    return filters;
  }

  private sortBooks(books: Book[]): Book[] {
    return [...books].sort((a, b) => a.title.localeCompare(b.title));
  }

  private sortCategories(categories: Category[]): Category[] {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name));
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
      return 'A requisição demorou mais que o esperado. Tente novamente.';
    }
    const typedError = error as { error?: { message?: string } };
    return typedError?.error?.message ?? fallback;
  }
}

type AlertState = {
  type: 'success' | 'error';
  message: string;
};

type StatusOption = {
  value: BookStatus;
  label: string;
};
