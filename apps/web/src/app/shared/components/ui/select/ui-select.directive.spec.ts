import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSelectDirective } from './ui-select.directive';

@Component({
  standalone: true,
  imports: [UiSelectDirective],
  template: `
    <select uiSelect>
      <option value="">Choose</option>
      <option value="a">A</option>
    </select>
  `,
})
class SelectHostComponent {}

describe('UiSelectDirective', () => {
  let fixture: ComponentFixture<SelectHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should apply baseline select classes', () => {
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');

    expect(select).toBeTruthy();
    expect(select.classList.contains('appearance-none')).toBeTrue();
    expect(select.classList.contains('w-full')).toBeTrue();
    expect(select.getAttribute('data-ui')).toBe('select');
  });
});
