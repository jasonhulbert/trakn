import { Component } from '@angular/core';

/**
 * Forms style guide page.
 *
 * This page documents the INTENDED themed state of form elements — the target
 * appearance once Phase 4 re-themes the shared UI component library.
 *
 * All class names use custom design-system tokens (surface-*, primary-*,
 * danger-*, success-*) rather than generic Tailwind colors. This page serves
 * as the design reference for Phase 4 implementation.
 */
@Component({
  selector: 'app-style-guide-forms',
  standalone: true,
  template: `
    <h1 class="text-3xl font-extrabold text-surface-900 tracking-tight mb-2">Forms</h1>
    <p class="text-surface-500 mb-2 max-w-2xl">
      Form elements styled with the custom design-system token palette. These visuals represent the intended themed
      state of the shared UI component library.
    </p>
    <p
      class="text-xs text-warning-700 bg-warning-50 border border-warning-200 rounded-lg px-4 py-2.5 mb-10 max-w-2xl inline-block"
    >
      <strong>Design spec:</strong> The actual <code class="font-mono">ui-*</code> components are re-themed in Phase 4.
      This page shows the target appearance.
    </p>

    <!-- Text Input -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-2">Text Input</h2>
      <p class="text-sm text-surface-500 mb-6">Standard text field in default, focused, disabled, and error states.</p>

      <div class="rounded-xl border border-surface-200 bg-white p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Default -->
          <div class="space-y-1.5">
            <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Default</p>
            <label for="input-name-default" class="block text-sm font-medium text-surface-700">Workout name</label>
            <input
              id="input-name-default"
              type="text"
              placeholder="e.g. Morning HIIT"
              class="w-full px-3 py-2 text-sm border border-surface-300 rounded-md bg-white text-surface-900 placeholder:text-surface-400 outline-none transition-colors"
              readonly
            />
            <p class="text-xs text-surface-400">Give your workout a memorable name.</p>
          </div>

          <!-- Focused -->
          <div class="space-y-1.5">
            <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Focused</p>
            <label for="input-name-focused" class="block text-sm font-medium text-surface-700">Workout name</label>
            <input
              id="input-name-focused"
              type="text"
              value="Morning HIIT"
              class="w-full px-3 py-2 text-sm border-2 border-primary-500 rounded-md bg-white text-surface-900 outline-none ring-3 ring-primary-100 transition-colors"
              readonly
            />
            <p class="text-xs text-surface-400">Give your workout a memorable name.</p>
          </div>

          <!-- Error -->
          <div class="space-y-1.5">
            <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Error</p>
            <label for="input-name-error" class="block text-sm font-medium text-surface-700">Workout name</label>
            <input
              id="input-name-error"
              type="text"
              value="  "
              class="w-full px-3 py-2 text-sm border-2 border-danger-500 rounded-md bg-white text-surface-900 outline-none ring-3 ring-danger-100 transition-colors"
              readonly
            />
            <p class="text-xs text-danger-600">Workout name is required.</p>
          </div>

          <!-- Disabled -->
          <div class="space-y-1.5">
            <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Disabled</p>
            <label for="input-name-disabled" class="block text-sm font-medium text-surface-400">Workout name</label>
            <input
              id="input-name-disabled"
              type="text"
              value="Morning HIIT"
              disabled
              class="w-full px-3 py-2 text-sm border border-surface-200 rounded-md bg-surface-50 text-surface-400 cursor-not-allowed outline-none"
            />
            <p class="text-xs text-surface-300">Give your workout a memorable name.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Textarea -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-2">Textarea</h2>
      <p class="text-sm text-surface-500 mb-6">Multi-line text input for longer content.</p>

      <div class="rounded-xl border border-surface-200 bg-white p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Default -->
          <div class="space-y-1.5">
            <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Default</p>
            <label for="textarea-notes-default" class="block text-sm font-medium text-surface-700">Notes</label>
            <textarea
              id="textarea-notes-default"
              placeholder="Add any notes about this workout..."
              rows="3"
              class="w-full px-3 py-2 text-sm border border-surface-300 rounded-md bg-white text-surface-900 placeholder:text-surface-400 outline-none resize-none transition-colors"
              readonly
            ></textarea>
          </div>

          <!-- Focused -->
          <div class="space-y-1.5">
            <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Focused</p>
            <label for="textarea-notes-focused" class="block text-sm font-medium text-surface-700">Notes</label>
            <textarea
              id="textarea-notes-focused"
              rows="3"
              class="w-full px-3 py-2 text-sm border-2 border-primary-500 rounded-md bg-white text-surface-900 outline-none ring-3 ring-primary-100 resize-none transition-colors"
              readonly
            >
Keep rest periods to 60s max.</textarea
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Select -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-2">Select</h2>
      <p class="text-sm text-surface-500 mb-6">Dropdown selection for a defined set of options.</p>

      <div class="rounded-xl border border-surface-200 bg-white p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Default -->
          <div class="space-y-1.5">
            <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Default</p>
            <label for="select-type-default" class="block text-sm font-medium text-surface-700">Workout type</label>
            <select
              id="select-type-default"
              class="w-full px-3 py-2 text-sm border border-surface-300 rounded-md bg-white text-surface-900 outline-none appearance-none transition-colors"
            >
              <option value="" disabled selected>Select a type…</option>
              <option>Conditioning</option>
              <option>Hypertrophy</option>
              <option>Strength</option>
            </select>
          </div>

          <!-- With value -->
          <div class="space-y-1.5">
            <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">With selection</p>
            <label for="select-type-selected" class="block text-sm font-medium text-surface-700">Workout type</label>
            <select
              id="select-type-selected"
              class="w-full px-3 py-2 text-sm border border-surface-300 rounded-md bg-white text-surface-900 outline-none appearance-none transition-colors"
            >
              <option>Conditioning</option>
              <option selected>Hypertrophy</option>
              <option>Strength</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Checkbox & Radio -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-2">Checkbox & Radio</h2>
      <p class="text-sm text-surface-500 mb-6">Selection controls using the primary accent color.</p>

      <div class="rounded-xl border border-surface-200 bg-white p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <!-- Checkboxes -->
          <div>
            <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">Checkboxes</p>
            <div class="space-y-3">
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked
                  class="w-4 h-4 rounded border-surface-300 text-primary-500 accent-primary-500"
                />
                <span class="text-sm text-surface-900">Upper body</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" class="w-4 h-4 rounded border-surface-300 text-primary-500 accent-primary-500" />
                <span class="text-sm text-surface-900">Lower body</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer opacity-50">
                <input type="checkbox" disabled class="w-4 h-4 rounded border-surface-200 cursor-not-allowed" />
                <span class="text-sm text-surface-400">Full body (disabled)</span>
              </label>
            </div>
          </div>

          <!-- Radios -->
          <div>
            <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">Radio Buttons</p>
            <div class="space-y-3">
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="difficulty"
                  value="beginner"
                  class="w-4 h-4 border-surface-300 text-primary-500 accent-primary-500"
                />
                <span class="text-sm text-surface-900">Beginner</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="difficulty"
                  value="intermediate"
                  checked
                  class="w-4 h-4 border-surface-300 text-primary-500 accent-primary-500"
                />
                <span class="text-sm text-surface-900">Intermediate</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="difficulty"
                  value="advanced"
                  class="w-4 h-4 border-surface-300 text-primary-500 accent-primary-500"
                />
                <span class="text-sm text-surface-900">Advanced</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Complete Form Example -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-2">Complete Form</h2>
      <p class="text-sm text-surface-500 mb-6">
        A representative workout-creation form showing how all elements compose together.
      </p>

      <div class="rounded-2xl border border-surface-200 bg-white overflow-hidden">
        <!-- Form header -->
        <div class="px-6 py-5 border-b border-surface-200">
          <h3 class="text-lg font-bold text-surface-900">Create Workout</h3>
          <p class="text-sm text-surface-500">Fill in the details to generate your workout plan.</p>
        </div>

        <!-- Form body -->
        <div class="px-6 py-6 space-y-5">
          <!-- Workout name -->
          <div class="space-y-1.5">
            <label for="form-workout-name" class="block text-sm font-medium text-surface-700">
              Workout name <span class="text-danger-500">*</span>
            </label>
            <input
              id="form-workout-name"
              type="text"
              placeholder="e.g. Push Day A"
              class="w-full px-3 py-2 text-sm border border-surface-300 rounded-md bg-white text-surface-900 placeholder:text-surface-400 outline-none transition-colors"
              readonly
            />
          </div>

          <!-- Workout type -->
          <div class="space-y-1.5">
            <label for="form-workout-type" class="block text-sm font-medium text-surface-700">
              Workout type <span class="text-danger-500">*</span>
            </label>
            <select
              id="form-workout-type"
              class="w-full px-3 py-2 text-sm border border-surface-300 rounded-md bg-white text-surface-900 outline-none appearance-none transition-colors"
            >
              <option value="" disabled selected>Select a type…</option>
              <option>Conditioning</option>
              <option>Hypertrophy</option>
              <option>Strength</option>
            </select>
          </div>

          <!-- Duration -->
          <div class="space-y-1.5">
            <label for="form-duration" class="block text-sm font-medium text-surface-700">
              Target duration (minutes)
            </label>
            <input
              id="form-duration"
              type="number"
              placeholder="45"
              class="w-full px-3 py-2 text-sm border border-surface-300 rounded-md bg-white text-surface-900 placeholder:text-surface-400 outline-none transition-colors"
              readonly
            />
            <p class="text-xs text-surface-400">We'll tailor the exercise count to fit this window.</p>
          </div>

          <!-- Notes -->
          <div class="space-y-1.5">
            <label for="form-notes" class="block text-sm font-medium text-surface-700">Notes</label>
            <textarea
              id="form-notes"
              rows="3"
              placeholder="Any injuries, equipment restrictions, or preferences…"
              class="w-full px-3 py-2 text-sm border border-surface-300 rounded-md bg-white text-surface-900 placeholder:text-surface-400 outline-none resize-none transition-colors"
              readonly
            ></textarea>
          </div>
        </div>

        <!-- Form footer -->
        <div class="px-6 py-4 bg-surface-50 border-t border-surface-200 flex items-center justify-end gap-3">
          <button
            class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-md bg-surface-100 text-surface-700 hover:bg-surface-200 transition-colors"
          >
            Cancel
          </button>
          <button
            class="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold rounded-md bg-primary-500 text-white hover:bg-primary-600 transition-colors"
          >
            Generate Workout
          </button>
        </div>
      </div>
    </section>

    <!-- Token Reference -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-2">Token Reference</h2>
      <p class="text-sm text-surface-500 mb-6">The color tokens used for each part of the form anatomy.</p>

      <div class="rounded-xl border border-surface-200 bg-white overflow-hidden divide-y divide-surface-100">
        <div class="grid grid-cols-3 px-6 py-2 bg-surface-50">
          <span class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Part</span>
          <span class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Token</span>
          <span class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Notes</span>
        </div>
        @for (row of tokenReference; track row.part) {
          <div class="grid grid-cols-3 px-6 py-3 items-center">
            <span class="text-sm text-surface-700">{{ row.part }}</span>
            <code class="text-xs font-mono text-primary-600">{{ row.token }}</code>
            <span class="text-xs text-surface-400">{{ row.notes }}</span>
          </div>
        }
      </div>
    </section>
  `,
  host: {
    class: 'block',
  },
})
export class StyleGuideFormsComponent {
  readonly tokenReference = [
    { part: 'Label', token: 'text-surface-700', notes: 'Medium weight' },
    { part: 'Input border (default)', token: 'border-surface-300', notes: '1px solid' },
    { part: 'Input border (focus)', token: 'border-primary-500', notes: '2px solid + ring-primary-100' },
    { part: 'Input border (error)', token: 'border-danger-500', notes: '2px solid + ring-danger-100' },
    { part: 'Input background', token: 'bg-white', notes: 'Always white in light mode' },
    { part: 'Input text', token: 'text-surface-900', notes: 'High contrast' },
    { part: 'Placeholder text', token: 'text-surface-400', notes: 'Muted' },
    { part: 'Description / hint', token: 'text-surface-400', notes: 'text-xs' },
    { part: 'Error message', token: 'text-danger-600', notes: 'text-sm' },
    { part: 'Disabled border', token: 'border-surface-200', notes: 'Lighter than default' },
    { part: 'Disabled background', token: 'bg-surface-50', notes: 'Slightly off-white' },
    { part: 'Disabled text', token: 'text-surface-400', notes: 'cursor-not-allowed' },
    { part: 'Required asterisk', token: 'text-danger-500', notes: 'Appended to label' },
    { part: 'Checkbox / radio accent', token: 'accent-primary-500', notes: 'Native control tinting' },
    { part: 'Primary action button', token: 'bg-primary-500 text-white', notes: 'hover: bg-primary-600' },
    { part: 'Secondary action button', token: 'bg-surface-100 text-surface-700', notes: 'hover: bg-surface-200' },
  ];
}
