import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiInputDirective } from './ui-input.directive';

@Component({
  standalone: true,
  imports: [UiInputDirective],
  template: `<input uiInput type="email" />`,
})
class InputHostComponent {}

describe('UiInputDirective', () => {
  let fixture: ComponentFixture<InputHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should apply baseline input classes', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');

    expect(input).toBeTruthy();
    expect(input.classList.contains('w-full')).toBeTrue();
    expect(input.classList.contains('border')).toBeTrue();
    expect(input.getAttribute('data-ui')).toBe('input');
  });
});
