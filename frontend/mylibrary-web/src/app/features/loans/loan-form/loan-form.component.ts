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
import { Book } from '../../../core/models/book.model';
import { LoanBorrowPayload } from '../../../core/services/loan.service';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loan-form.component.html',
  styleUrls: ['./loan-form.component.css']
})
export class LoanFormComponent {
  private readonly today = this.getCurrentDateForInput();

  @Input() public books: Book[] = [];
  @Input() public isSubmitting = false;
  @Input() public isBooksLoading = false;
  @Output() public submitLoan = new EventEmitter<LoanBorrowPayload>(true);

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

  private readonly expectedReturnDateValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const value = (control.value ?? '').toString();
    if (value.length === 0) {
      return null;
    }

    return value < this.today ? { beforeLoanDate: true } : null;
  };

  public constructor(private readonly formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      bookId: [null, [Validators.required]],
      personName: ['', [Validators.required, this.noWhitespaceValidator]],
      personPhone: ['', [Validators.required, this.noWhitespaceValidator]],
      expectedReturnDate: [this.today, [Validators.required, this.expectedReturnDateValidator]]
    });
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const bookId = Number(this.form.value.bookId);
    const personName = (this.form.value.personName ?? '').toString().trim();
    const personPhone = (this.form.value.personPhone ?? '').toString().trim();
    const expectedReturnDate = (this.form.value.expectedReturnDate ?? '').toString();

    this.submitLoan.emit({
      bookId,
      personName,
      personPhone,
      expectedReturnDate
    });
  }

  public resetForm(): void {
    this.form.reset({
      bookId: null,
      personName: '',
      personPhone: '',
      expectedReturnDate: this.today
    });
  }

  public isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  public getMinExpectedReturnDate(): string {
    return this.today;
  }

  private getCurrentDateForInput(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
