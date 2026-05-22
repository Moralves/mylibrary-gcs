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
import { CategoryCreatePayload } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent {
  @Input() public isSubmitting = false;
  @Output() public submitCategory = new EventEmitter<CategoryCreatePayload>();

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

  public constructor(private readonly formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      description: ['']
    });
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const name = (this.form.value.name ?? '').trim();
    const descriptionValue = (this.form.value.description ?? '').toString().trim();
    const description = descriptionValue.length > 0 ? descriptionValue : undefined;

    this.submitCategory.emit({ name, description });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }
}
