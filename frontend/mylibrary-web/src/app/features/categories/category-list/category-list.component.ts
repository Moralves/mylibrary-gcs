import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
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

  public categories: Category[] = [];
  public isLoading = false;
  public isSubmitting = false;
  public deletingId: number | null = null;
  public alertMessage: string | null = null;
  public alertType: 'success' | 'error' | null = null;

  public constructor(private readonly categoryService: CategoryService) {}

  public ngOnInit(): void {
    this.loadCategories();
  }

  public onSubmitCategory(payload: CategoryCreatePayload): void {
    this.isSubmitting = true;
    this.clearAlert();

    this.categoryService
      .createCategory(payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (category) => {
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
      .pipe(finalize(() => (this.deletingId = null)))
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
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (categories) => (this.categories = this.sortCategories(categories)),
        error: (error) => {
          this.showError(this.getErrorMessage(error, 'Não foi possível carregar as categorias.'));
        }
      });
  }

  private sortCategories(categories: Category[]): Category[] {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name));
  }

  private showSuccess(message: string): void {
    this.alertMessage = message;
    this.alertType = 'success';
  }

  private showError(message: string): void {
    this.alertMessage = message;
    this.alertType = 'error';
  }

  private clearAlert(): void {
    this.alertMessage = null;
    this.alertType = null;
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    const typedError = error as { error?: { message?: string } };
    return typedError?.error?.message ?? fallback;
  }
}
