import { Component, HostBinding, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IconComponent,
  UiAccordionContentDirective,
  UiAccordionDirective,
  UiAccordionItemDirective,
  UiAccordionTriggerDirective,
  UiButtonDirective,
  UiTextareaDirective,
} from 'src/app/shared/components';

@Component({
  selector: 'app-revision-input',
  standalone: true,
  imports: [
    FormsModule,
    IconComponent,
    UiAccordionDirective,
    UiAccordionItemDirective,
    UiAccordionTriggerDirective,
    UiAccordionContentDirective,
    UiButtonDirective,
    UiTextareaDirective,
  ],
  template: `
    <div
      uiAccordion
      uiAccordionType="single"
      [uiAccordionCollapsible]="true"
      [uiAccordionValue]="accordionValue()"
      (uiAccordionValueChange)="onAccordionValueChange($event)"
      class="w-full divide-y-0 border-0 bg-transparent"
    >
      <div [uiAccordionItem]="'revision'" class="border-0">
        <button uiAccordionTrigger [disabled]="isLoading()" class="h-full w-auto px-0 py-0 hover:bg-transparent">
          <span class="inline-flex items-center gap-2 text-sm font-medium text-accent-500 hover:text-accent-400">
            <app-icon name="sparks" class="inline-block h-6 w-6"></app-icon>
            <span>{{ label() }}</span>
          </span>
        </button>

        @if (isExpanded()) {
          <div uiAccordionContent class="w-full px-0 pb-0 pt-2">
            <div class="w-full space-y-2">
              <textarea
                uiTextarea
                [(ngModel)]="revisionText"
                [placeholder]="placeholder()"
                [disabled]="isLoading()"
                rows="2"
                maxlength="500"
                class="text-sm"
              ></textarea>
              <div class="flex items-center justify-between">
                <span class="text-xs text-fore-700">{{ revisionText.length }}/500</span>
                <div class="flex gap-2">
                  <button type="button" uiButton (click)="onCancel()" [disabled]="isLoading()">Cancel</button>
                  <button
                    type="button"
                    uiButton
                    (click)="onSubmit()"
                    [disabled]="isLoading() || revisionText.trim().length === 0"
                  >
                    {{ isLoading() ? 'Revising...' : 'Revise' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class RevisionInputComponent {
  @HostBinding('class') class = 'flex items-center';

  label = input<string>('Revise with AI');
  placeholder = input<string>('Describe how you want this changed...');
  isLoading = input<boolean>(false);

  submitted = output<string>();

  isExpanded = signal(false);
  protected readonly accordionValue = computed(() => (this.isExpanded() ? 'revision' : null));
  revisionText = '';

  protected onAccordionValueChange(value: unknown): void {
    if (Array.isArray(value)) {
      this.isExpanded.set(value.includes('revision'));
      return;
    }
    this.isExpanded.set(value === 'revision');
  }

  onSubmit(): void {
    const text = this.revisionText.trim();
    if (text.length > 0) {
      this.submitted.emit(text);
    }
  }

  onCancel(): void {
    this.revisionText = '';
    this.isExpanded.set(false);
  }

  resetAfterSuccess(): void {
    this.revisionText = '';
    this.isExpanded.set(false);
  }
}
