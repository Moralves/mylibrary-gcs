import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, finalize, timeout, TimeoutError } from 'rxjs';
import { Category } from '../../../core/models/category.model';
import {
  CategoryCreatePayload,
  CategoryService
} from '../../../core/services/category.service';
import { CategoryFormComponent } from '../category-form/category-form.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, CategoryFormComponent],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  @ViewChild(CategoryFormComponent) private formComponent?: CategoryFormComponent;

  private readonly alertSubject = new BehaviorSubject<AlertState | null>(null);

  public categories: Category[] = [];
  public isLoading = false;
  public isSubmitting = false;
  public deletingId: number | null = null;
  public readonly alert$ = this.alertSubject.asObservable();

  public constructor(private readonly categoryService: CategoryService) {}

  public ngOnInit(): void {
    this.loadCategories();
  }

  public onSubmitCategory(payload: CategoryCreatePayload): void {
    this.isSubmitting = true;
    this.clearAlert();

    this.categoryService
      .createCategory(payload)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: (category) => {
          if (!category || !category.id || !category.name) {
            this.showError('Resposta inválida ao cadastrar a categoria.');
            return;
          }
          this.categories = this.sortCategories([...this.categories, category]);
          this.formComponent?.resetForm();
          this.showSuccess('Categoria cadastrada com sucesso.');
        },
        error: (error) => {
          this.showError(this.getErrorMessage(error, 'Não foi possível cadastrar a categoria.'));
        }
      });
  }

  public onDeleteCategory(category: Category): void {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a categoria "${category.name}"?`
    );
    if (!confirmed) {
      return;
    }

    this.deletingId = category.id;
    this.clearAlert();

    this.categoryService
      .deleteCategory(category.id)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.deletingId = null;
        })
      )
      .subscribe({
        next: () => {
          this.categories = this.categories.filter((item) => item.id !== category.id);
          this.showSuccess('Categoria excluída com sucesso.');
        },
        error: (error) => {
          this.showError(this.getErrorMessage(error, 'Não foi possível excluir a categoria.'));
        }
      });
  }

  private loadCategories(): void {
    this.isLoading = true;
    this.clearAlert();

    this.categoryService
      .listCategories()
      .pipe(
        timeout(10000),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (categories) => {
          const safeCategories = Array.isArray(categories) ? categories : [];
          this.categories = this.sortCategories(safeCategories);
        },
        error: (error) => {
          this.showError(this.getErrorMessage(error, 'Não foi possível carregar as categorias.'));
        }
      });
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
