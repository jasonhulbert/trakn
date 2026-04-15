import { Component } from '@angular/core';

/**
 * Forms style guide page.
 *
 * This page documents the dark-aesthetic form elements using the rebrand
 * token palette (base-*, fore-*, accent-*, danger-*). All examples reflect
 * the current themed state of the shared UI component library.
 */
@Component({
  selector: 'app-style-guide-forms',
  standalone: true,
  template: `
    <h1 class="text-3xl font-extrabold text-fore-300 tracking-tight mb-2">Forms</h1>
    <p class="text-fore-600 mb-10 max-w-2xl">
      Form elements styled with the custom design-system token palette. These visuals represent the dark-aesthetic
      themed state of the shared UI component library.
    </p>

    <!-- Text Input -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-fore-300 mb-2">Text Input</h2>
      <p class="text-sm text-fore-600 mb-6">Standard text field in default, focused, disabled, and error states.</p>

      <div class="rounded-xl border border-base-700 bg-base-800 p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Default -->
          <div class="space-y-1.5">
            <p class="text-xs font-semibold text-fore-700 uppercase tracking-wider mb-3">Default</p>
            <label for="input-name-default" class="block text-sm font-medium text-fore-300">Workout name</label>
            <input
              id="input-name-default"
              type="text"
              placeholder="e.g. Morning HIIT"
              class="w-full px-3 py-2 text-sm border border-base-600 rounded-md bg-base-900 text-fore-300 placeholder:text-fore-700 outline-none transition-colors"
              readonly
            />
            <p class="text-xs text-fore-700">Give your workout a memorable name.</p>
          </div>

          <!-- Focused -->
          <div class="space-y-1.5">
            <p class="text-xs font-semibold text-fore-700 uppercase tracking-wider mb-3">Focused</p>
            <label for="input-name-focused" class="block text-sm font-medium text-fore-300">Workout name</label>
            <input
              id="input-name-focused"
              type="text"
              value="Morning HIIT"
              class="w-full px-3 py-2 text-sm border-2 border-accent-500 rounded-md bg-base-900 text-fore-300 outline-none ring-3 ring-accent-500/20 transition-colors"
              readonly
            />
            <p class="text-xs text-fore-700">Give your workout a memorable name.</p>
          </div>

          <!-- Error -->
          <div class="space-y-1.5">
            <p class="text-xs font-semibold text-fore-700 uppercase tracking-wider mb-3">Error</p>
            <label for="input-name-error" class="block text-sm font-medium text-fore-300">Workout name</label>
            <input
              id="input-name-error"
              type="text"
              value="  "
              class="w-full px-3 py-2 text-sm border-2 border-danger-500 rounded-md bg-base-900 text-fore-300 outline-none ring-3 ring-danger-500/20 transition-colors"
              readonly
            />
            <p class="text-xs text-danger-400">Workout name is required.</p>
          </div>

          <!-- Disabled -->
          <div class="space-y-1.5">
            <p class="text-xs font-semibold text-fore-700 uppercase tracking-wider mb-3">Disabled</p>
            <label for="input-name-disabled" class="block text-sm font-medium text-fore-700">Workout name</label>
            <input
              id="input-name-disabled"
              type="text"
              value="Morning HIIT"
              disabled
              class="w-full px-3 py-2 text-sm border border-base-700 rounded-md bg-base-950 text-fore-700 cursor-not-allowed outline-none"
            />
            <p class="text-xs text-fore-700">Give your workout a memorable name.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Textarea -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-fore-300 mb-2">Textarea</h2>
      <p class="text-sm text-fore-600 mb-6">Multi-line text input for longer content.</p>

      <div class="rounded-xl border border-base-700 bg-base-800 p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Default -->
          <div class="space-y-1.5">
            <p class="text-xs font-semibold text-fore-700 uppercase tracking-wider mb-3">Default</p>
            <label for="textarea-notes-default" class="block text-sm font-medium text-fore-300">Notes</label>
            <textarea
              id="textarea-notes-default"
              placeholder="Add any notes about this workout..."
              rows="3"
              class="w-full px-3 py-2 text-sm border border-base-600 rounded-md bg-base-900 text-fore-300 placeholder:text-fore-700 outline-none resize-none transition-colors"
              readonly
            ></textarea>
          </div>

          <!-- Focused -->
          <div class="space-y-1.5">
            <p class="text-xs font-semibold text-fore-700 uppercase tracking-wider mb-3">Focused</p>
            <label for="textarea-notes-focused" class="block text-sm font-medium text-fore-300">Notes</label>
            <textarea
              id="textarea-notes-focused"
              rows="3"
              class="w-full px-3 py-2 text-sm border-2 border-accent-500 rounded-md bg-base-900 text-fore-300 outline-none ring-3 ring-accent-500/20 resize-none transition-colors"
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
      <h2 class="text-xl font-bold text-fore-300 mb-2">Select</h2>
      <p class="text-sm text-fore-600 mb-6">Dropdown selection for a defined set of options.</p>

      <div class="rounded-xl border border-base-700 bg-base-800 p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Default -->
          <div class="space-y-1.5">
            <p class="text-xs font-semibold text-fore-700 uppercase tracking-wider mb-3">Default</p>
            <label for="select-type-default" class="block text-sm font-medium text-fore-300">Workout type</label>
            <select
              id="select-type-default"
              class="w-full px-3 py-2 text-sm border border-base-600 rounded-md bg-base-900 text-fore-300 outline-none appearance-none transition-colors"
            >
              <option value="" disabled selected>Select a type…</option>
              <option>Conditioning</option>
              <option>Hypertrophy</option>
              <option>Strength</option>
            </select>
          </div>

          <!-- With value -->
          <div class="space-y-1.5">
            <p class="text-xs font-semibold text-fore-700 uppercase tracking-wider mb-3">With selection</p>
            <label for="select-type-selected" class="block text-sm font-medium text-fore-300">Workout type</label>
            <select
              id="select-type-selected"
              class="w-full px-3 py-2 text-sm border border-base-600 rounded-md bg-base-900 text-fore-300 outline-none appearance-none transition-colors"
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
      <h2 class="text-xl font-bold text-fore-300 mb-2">Checkbox & Radio</h2>
      <p class="text-sm text-fore-600 mb-6">Selection controls using the primary accent color.</p>

      <div class="rounded-xl border border-base-700 bg-base-800 p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <!-- Checkboxes -->
          <div>
            <p class="text-xs font-semibold text-fore-700 uppercase tracking-wider mb-4">Checkboxes</p>
            <div class="space-y-3">
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked
                  class="w-4 h-4 rounded border-base-600 text-accent-500 accent-accent-500"
                />
                <span class="text-sm text-fore-300">Upper body</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" class="w-4 h-4 rounded border-base-600 text-accent-500 accent-accent-500" />
                <span class="text-sm text-fore-300">Lower body</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer opacity-50">
                <input type="checkbox" disabled class="w-4 h-4 rounded border-base-700 cursor-not-allowed" />
                <span class="text-sm text-fore-700">Full body (disabled)</span>
              </label>
            </div>
          </div>

          <!-- Radios -->
          <div>
            <p class="text-xs font-semibold text-fore-700 uppercase tracking-wider mb-4">Radio Buttons</p>
            <div class="space-y-3">
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="difficulty"
                  value="beginner"
                  class="w-4 h-4 border-base-600 text-accent-500 accent-accent-500"
                />
                <span class="text-sm text-fore-300">Beginner</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="difficulty"
                  value="intermediate"
                  checked
                  class="w-4 h-4 border-base-600 text-accent-500 accent-accent-500"
                />
                <span class="text-sm text-fore-300">Intermediate</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="difficulty"
                  value="advanced"
                  class="w-4 h-4 border-base-600 text-accent-500 accent-accent-500"
                />
                <span class="text-sm text-fore-300">Advanced</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Complete Form Example -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-fore-300 mb-2">Complete Form</h2>
      <p class="text-sm text-fore-600 mb-6">
        A representative workout-creation form showing how all elements compose together.
      </p>

      <div class="rounded-2xl border border-base-700 bg-base-800 overflow-hidden">
        <!-- Form header -->
        <div class="px-6 py-5 border-b border-base-700">
          <h3 class="text-lg font-bold text-fore-300">Create Workout</h3>
          <p class="text-sm text-fore-600">Fill in the details to generate your workout plan.</p>
        </div>

        <!-- Form body -->
        <div class="px-6 py-6 space-y-5">
          <!-- Workout name -->
          <div class="space-y-1.5">
            <label for="form-workout-name" class="block text-sm font-medium text-fore-300">
              Workout name <span class="text-danger-500">*</span>
            </label>
            <input
              id="form-workout-name"
              type="text"
              placeholder="e.g. Push Day A"
              class="w-full px-3 py-2 text-sm border border-base-600 rounded-md bg-base-900 text-fore-300 placeholder:text-fore-700 outline-none transition-colors"
              readonly
            />
          </div>

          <!-- Workout type -->
          <div class="space-y-1.5">
            <label for="form-workout-type" class="block text-sm font-medium text-fore-300">
              Workout type <span class="text-danger-500">*</span>
            </label>
            <select
              id="form-workout-type"
              class="w-full px-3 py-2 text-sm border border-base-600 rounded-md bg-base-900 text-fore-300 outline-none appearance-none transition-colors"
            >
              <option value="" disabled selected>Select a type…</option>
              <option>Conditioning</option>
              <option>Hypertrophy</option>
              <option>Strength</option>
            </select>
          </div>

          <!-- Duration -->
          <div class="space-y-1.5">
            <label for="form-duration" class="block text-sm font-medium text-fore-300">
              Target duration (minutes)
            </label>
            <input
              id="form-duration"
              type="number"
              placeholder="45"
              class="w-full px-3 py-2 text-sm border border-base-600 rounded-md bg-base-900 text-fore-300 placeholder:text-fore-700 outline-none transition-colors"
              readonly
            />
            <p class="text-xs text-fore-700">We'll tailor the exercise count to fit this window.</p>
          </div>

          <!-- Notes -->
          <div class="space-y-1.5">
            <label for="form-notes" class="block text-sm font-medium text-fore-300">Notes</label>
            <textarea
              id="form-notes"
              rows="3"
              placeholder="Any injuries, equipment restrictions, or preferences…"
              class="w-full px-3 py-2 text-sm border border-base-600 rounded-md bg-base-900 text-fore-300 placeholder:text-fore-700 outline-none resize-none transition-colors"
              readonly
            ></textarea>
          </div>
        </div>

        <!-- Form footer -->
        <div class="px-6 py-4 bg-base-900 border-t border-base-700 flex items-center justify-end gap-3">
          <button
            class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-md bg-base-700 text-fore-300 hover:bg-base-600 transition-colors"
          >
            Cancel
          </button>
          <button
            class="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold rounded-md bg-accent-500 text-base-950 hover:bg-accent-600 transition-colors"
          >
            Generate Workout
          </button>
        </div>
      </div>
    </section>

    <!-- Token Reference -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-fore-300 mb-2">Token Reference</h2>
      <p class="text-sm text-fore-600 mb-6">The color tokens used for each part of the form anatomy.</p>

      <div class="rounded-xl border border-base-700 bg-base-800 overflow-hidden divide-y divide-base-700">
        <div class="grid grid-cols-3 px-6 py-2 bg-base-900">
          <span class="text-xs font-semibold text-fore-600 uppercase tracking-wider">Part</span>
          <span class="text-xs font-semibold text-fore-600 uppercase tracking-wider">Token</span>
          <span class="text-xs font-semibold text-fore-600 uppercase tracking-wider">Notes</span>
        </div>
        @for (row of tokenReference; track row.part) {
          <div class="grid grid-cols-3 px-6 py-3 items-center">
            <span class="text-sm text-fore-300">{{ row.part }}</span>
            <code class="text-xs font-mono text-accent-500">{{ row.token }}</code>
            <span class="text-xs text-fore-700">{{ row.notes }}</span>
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
    { part: 'Label', token: 'text-fore-300', notes: 'Medium weight' },
    { part: 'Input border (default)', token: 'border-base-600', notes: '1px solid' },
    { part: 'Input border (focus)', token: 'border-accent-500', notes: '2px solid + ring-accent-500/20' },
    { part: 'Input border (error)', token: 'border-danger-500', notes: '2px solid + ring-danger-500/20' },
    { part: 'Input background', token: 'bg-base-900', notes: 'Dark surface' },
    { part: 'Input text', token: 'text-fore-300', notes: 'High contrast' },
    { part: 'Placeholder text', token: 'text-fore-700', notes: 'Muted' },
    { part: 'Description / hint', token: 'text-fore-700', notes: 'text-xs' },
    { part: 'Error message', token: 'text-danger-400', notes: 'text-sm' },
    { part: 'Disabled border', token: 'border-base-700', notes: 'Subtle' },
    { part: 'Disabled background', token: 'bg-base-950', notes: 'Darkest surface' },
    { part: 'Disabled text', token: 'text-fore-700', notes: 'cursor-not-allowed' },
    { part: 'Required asterisk', token: 'text-danger-500', notes: 'Appended to label' },
    { part: 'Checkbox / radio accent', token: 'accent-accent-500', notes: 'Native control tinting' },
    { part: 'Primary action button', token: 'bg-accent-500 text-base-950', notes: 'hover: bg-accent-600' },
    { part: 'Secondary action button', token: 'bg-base-700 text-fore-300', notes: 'hover: bg-base-600' },
  ];
}
