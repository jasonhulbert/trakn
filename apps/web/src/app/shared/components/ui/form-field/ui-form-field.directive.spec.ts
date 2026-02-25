import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { UiInputDirective } from '../input/ui-input.directive';
import { UiDescriptionDirective } from './ui-description.directive';
import { UiErrorDirective } from './ui-error.directive';
import { UiFormFieldDirective } from './ui-form-field.directive';
import { UiLabelDirective } from './ui-label.directive';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UiFormFieldDirective,
    UiLabelDirective,
    UiDescriptionDirective,
    UiErrorDirective,
    UiInputDirective,
  ],
  template: `
    <form [formGroup]="form">
      <div uiFormField>
        <label uiLabel for="email">Email</label>
        <input id="email" uiInput type="email" formControlName="email" />
        <p uiDescription>Use a valid email address.</p>
        @if (form.controls.email.invalid && form.controls.email.touched) {
          <p uiError>Email is required.</p>
        }
      </div>
    </form>
  `,
})
class FormFieldHostComponent {
  form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
}

describe('UiFormField wrappers', () => {
  let fixture: ComponentFixture<FormFieldHostComponent>;
  let component: FormFieldHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should render form-field structure with wrapper markers', () => {
    const field: HTMLElement = fixture.nativeElement.querySelector('[data-ui="form-field"]');
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
    const description: HTMLElement = fixture.nativeElement.querySelector('[data-ui="description"]');

    expect(field).toBeTruthy();
    expect(label).toBeTruthy();
    expect(description).toBeTruthy();
    expect(label.getAttribute('data-ui')).toBe('label');
  });

  it('should render uiError when control is touched and invalid', () => {
    component.form.controls.email.markAsTouched();
    fixture.detectChanges();

    const error: HTMLElement | null = fixture.nativeElement.querySelector('[data-ui="error"]');
    expect(error).not.toBeNull();
  });
});
