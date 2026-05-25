import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Category } from '../../../core/models/category.model';
import { BookCreatePayload } from '../../../core/services/book.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent {
  private readonly currentYear = new Date().getFullYear();

  @Input() public categories: Category[] = [];
  @Input() public isSubmitting = false;
  @Input() public isCategoriesLoading = false;
  @Output() public submitBook = new EventEmitter<BookCreatePayload>(true);

  public readonly form;

  private readonly noWhitespaceValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined) {
      return null;
    }
    const valueText = value.toString();
    if (valueText.length === 0) {
      return null;
    }
    return valueText.trim().length === 0 ? { whitespace: true } : null;
  };

  private readonly publicationYearValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const parsedValue = Number(value);
    if (Number.isNaN(parsedValue)) {
      return { invalidNumber: true };
    }

    if (parsedValue > this.currentYear) {
      return { maxYear: true };
    }

    return null;
  };

  public constructor(private readonly formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, this.noWhitespaceValidator]],
      author: ['', [Validators.required, this.noWhitespaceValidator]],
      isbn: [''],
      publicationYear: [null, [this.publicationYearValidator]],
      categoryId: [null, [Validators.required]]
    });
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const title = (this.form.value.title ?? '').trim();
    const author = (this.form.value.author ?? '').trim();
    const isbnValue = (this.form.value.isbn ?? '').toString().trim();
    const isbn = isbnValue.length > 0 ? isbnValue : undefined;

    const publicationYearValue = this.form.value.publicationYear;
    const publicationYear =
      publicationYearValue === null || publicationYearValue === undefined || publicationYearValue === ''
        ? undefined
        : Number(publicationYearValue);

    const categoryIdValue = this.form.value.categoryId;
    const categoryId = Number(categoryIdValue);

    this.submitBook.emit({
      title,
      author,
      isbn,
      publicationYear,
      categoryId
    });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  public getCurrentYear(): number {
    return this.currentYear;
  }
}
