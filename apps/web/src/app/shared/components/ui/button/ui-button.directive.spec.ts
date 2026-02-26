import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiButtonDirective } from './ui-button.directive';

@Component({
  standalone: true,
  imports: [UiButtonDirective],
  template: `<button uiButton type="button">Save</button>`,
})
class ButtonHostComponent {}

describe('UiButtonDirective', () => {
  let fixture: ComponentFixture<ButtonHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should apply baseline button classes', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button).toBeTruthy();
    expect(button.classList.contains('inline-flex')).toBeTrue();
    expect(button.classList.contains('bg-blue-600')).toBeTrue();
    expect(button.getAttribute('data-ui')).toBe('button');
  });
});
