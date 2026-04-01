import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiButtonDirective } from './ui-button.directive';

@Component({
  standalone: true,
  imports: [UiButtonDirective],
  template: `<button uiButton type="button">Save</button>`,
})
class DefaultButtonHostComponent {}

@Component({
  standalone: true,
  imports: [UiButtonDirective],
  template: `<button uiButton variant="outline" color="danger" size="sm" type="button">Delete</button>`,
})
class VariantButtonHostComponent {}

describe('UiButtonDirective', () => {
  describe('default (solid default md)', () => {
    let fixture: ComponentFixture<DefaultButtonHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [DefaultButtonHostComponent] }).compileComponents();
      fixture = TestBed.createComponent(DefaultButtonHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should apply baseline layout classes', () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(button).toBeTruthy();
      expect(button.classList.contains('inline-flex')).toBeTrue();
      expect(button.getAttribute('data-ui')).toBe('button');
      expect(button.getAttribute('data-variant')).toBe('solid');
      expect(button.getAttribute('data-color')).toBe('default');
      expect(button.getAttribute('data-size')).toBe('md');
    });

    it('should apply default solid color class', () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(button.classList.contains('bg-base-700')).toBeTrue();
    });
  });

  describe('variant inputs', () => {
    let fixture: ComponentFixture<VariantButtonHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [VariantButtonHostComponent] }).compileComponents();
      fixture = TestBed.createComponent(VariantButtonHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should apply outline danger sm classes', () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('data-variant')).toBe('outline');
      expect(button.getAttribute('data-color')).toBe('danger');
      expect(button.getAttribute('data-size')).toBe('sm');
      expect(button.classList.contains('border-2')).toBeTrue();
      expect(button.classList.contains('text-danger-400')).toBeTrue();
    });
  });
});
