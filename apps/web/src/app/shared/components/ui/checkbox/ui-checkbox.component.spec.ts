import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCheckboxComponent } from './ui-checkbox.component';

@Component({
  standalone: true,
  imports: [UiCheckboxComponent],
  template: `
    <ui-checkbox [checked]="checked" ariaLabel="Tempo focus" (checkedChange)="onCheckedChange($event)"
      >Tempo focus</ui-checkbox
    >
  `,
})
class CheckboxHostComponent {
  checked = false;
  events: boolean[] = [];

  onCheckedChange(value: boolean): void {
    this.events.push(value);
    this.checked = value;
  }
}

describe('UiCheckboxComponent', () => {
  let fixture: ComponentFixture<CheckboxHostComponent>;
  let component: CheckboxHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should render and emit checked changes on click', () => {
    const host: HTMLElement = fixture.nativeElement.querySelector('ui-checkbox');
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('ui-checkbox button');

    expect(host).toBeTruthy();
    expect(host.getAttribute('data-ui')).toBe('checkbox');
    expect(button).toBeTruthy();

    button.click();
    fixture.detectChanges();

    expect(component.events).toEqual([true]);
    expect(component.checked).toBeTrue();
  });
});
