import { Component, HostBinding, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from 'src/app/shared/components';

@Component({
  selector: 'app-revision-input',
  standalone: true,
  imports: [FormsModule, IconComponent],
  template: `
    @if (!isExpanded()) {
      <button
        type="button"
        (click)="isExpanded.set(true)"
        class="inline-flex items-center gap-2 w-auto h-full text-sm text-blue-600 hover:text-blue-800 font-medium"
        [disabled]="isLoading()"
      >
        <app-icon name="sparks" class="w-6 h-6 inline-block"></app-icon>
        <span>{{ label() }}</span>
      </button>
    } @else {
      <div class="w-full mt-2 space-y-2">
        <textarea
          [(ngModel)]="revisionText"
          [placeholder]="placeholder()"
          [disabled]="isLoading()"
          rows="2"
          maxlength="500"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 resize-none"
        ></textarea>
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-400">{{ revisionText.length }}/500</span>
          <div class="flex gap-2">
            <button
              type="button"
              (click)="onCancel()"
              [disabled]="isLoading()"
              class="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              (click)="onSubmit()"
              [disabled]="isLoading() || revisionText.trim().length === 0"
              class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
            >
              @if (isLoading()) {
                <span
                  class="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"
                ></span>
                Revising...
              } @else {
                Revise
              }
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
  `,
})
export class RevisionInputComponent {
  @HostBinding('class') class = 'flex items-center';

  label = input<string>('Revise with AI');
  placeholder = input<string>('Describe how you want this changed...');
  isLoading = input<boolean>(false);

  submitted = output<string>();

  isExpanded = signal(false);
  revisionText = '';

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
