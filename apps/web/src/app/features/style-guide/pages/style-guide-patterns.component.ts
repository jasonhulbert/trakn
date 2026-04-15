import { Component } from '@angular/core';
import {
  UiPatternComponent,
  UiPatternHeroComponent,
  UiPatternDividerComponent,
} from '../../../shared/components/ui';

@Component({
  selector: 'app-style-guide-patterns',
  standalone: true,
  imports: [UiPatternComponent, UiPatternHeroComponent, UiPatternDividerComponent],
  template: `
    <h1 class="text-3xl font-extrabold text-fore-300 tracking-tight mb-2">Patterns</h1>
    <p class="text-fore-600 mb-10 max-w-2xl">
      Geometric patterns replace per-type colors as the primary visual differentiator for workout types.
      Each pattern is rendered as a CSS background and overlaid at low opacity behind content cards.
    </p>

    <!-- Workout-Type Patterns -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-fore-300 mb-2">Workout-Type Patterns</h2>
      <p class="text-sm text-fore-600 mb-6">
        Each workout type has a unique geometric pattern that provides visual identity without relying on color alone.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        @for (pattern of workoutPatterns; track pattern.type) {
          <div class="bg-base-800 border border-base-700 rounded-xl overflow-hidden">
            <div class="relative h-32">
              <ui-pattern [type]="pattern.type" />
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-sm font-bold text-fore-300 bg-base-900/70 px-3 py-1 rounded-md">
                  {{ pattern.label }}
                </span>
              </div>
            </div>
            <div class="p-4 border-t border-base-700">
              <p class="text-xs font-semibold text-accent-400 mb-1">{{ pattern.shape }}</p>
              <p class="text-sm text-fore-600">{{ pattern.description }}</p>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- Opacity Reference -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-fore-300 mb-2">Opacity Reference</h2>
      <p class="text-sm text-fore-600 mb-6">
        Patterns support a configurable opacity input. Use lower values behind content and higher values for decorative areas.
      </p>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        @for (level of opacityLevels; track level.value) {
          <div class="bg-base-800 border border-base-700 rounded-xl overflow-hidden">
            <div class="relative h-24">
              <ui-pattern type="hypertrophy" [opacity]="level.value" />
            </div>
            <div class="p-3 border-t border-base-700 text-center">
              <span class="text-xs font-mono text-fore-500">opacity: {{ level.label }}</span>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- Hero Pattern -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-fore-300 mb-2">Hero Pattern</h2>
      <p class="text-sm text-fore-600 mb-6">
        A large-scale decorative SVG pattern used on login, register, and maintenance pages as a full-width backdrop.
      </p>
      <div class="relative h-48 rounded-xl overflow-hidden bg-base-900">
        <ui-pattern-hero />
      </div>
    </section>

    <!-- Divider -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-fore-300 mb-2">Divider</h2>
      <p class="text-sm text-fore-600 mb-6">
        A patterned divider used as an alternative to a plain horizontal rule for major section breaks.
      </p>
      <div class="bg-base-800 border border-base-700 rounded-xl p-6">
        <p class="text-sm text-fore-500 mb-4">Content above the divider</p>
        <ui-pattern-divider />
        <p class="text-sm text-fore-500 mt-4">Content below the divider</p>
      </div>
    </section>

    <!-- Usage Guidelines -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-fore-300 mb-2">Usage Guidelines</h2>
      <div class="rounded-xl border border-base-700 bg-base-800 overflow-hidden divide-y divide-base-700">
        @for (guideline of guidelines; track guideline.rule) {
          <div class="flex items-start gap-3 px-6 py-4">
            <span
              class="shrink-0 mt-0.5 font-bold"
              [class]="guideline.allowed ? 'text-green-500' : 'text-red-500'"
            >
              {{ guideline.allowed ? '&#10003;' : '&#10007;' }}
            </span>
            <p class="text-sm text-fore-500">{{ guideline.rule }}</p>
          </div>
        }
      </div>
    </section>
  `,
  host: {
    class: 'block',
  },
})
export class StyleGuidePatternsComponent {
  readonly workoutPatterns = [
    {
      type: 'hypertrophy' as const,
      label: 'Hypertrophy',
      shape: 'Concentric Circles',
      description: 'Nested circles radiating outward, representing growth and volume.',
    },
    {
      type: 'strength' as const,
      label: 'Strength',
      shape: 'Grid Lines',
      description: 'Intersecting right-angle lines, representing structure and power.',
    },
    {
      type: 'conditioning' as const,
      label: 'Conditioning',
      shape: 'Concentric Waves',
      description: 'Diagonal wave pattern, representing rhythm and endurance.',
    },
  ];

  readonly opacityLevels = [
    { value: 0.04, label: '0.04' },
    { value: 0.08, label: '0.08 (default)' },
    { value: 0.15, label: '0.15' },
    { value: 0.25, label: '0.25' },
  ];

  readonly guidelines = [
    { allowed: true, rule: 'Use patterns at low opacity (0.04\u20130.10) behind content cards.' },
    { allowed: true, rule: 'Use the hero pattern on auth and splash pages.' },
    { allowed: true, rule: 'Use the divider for major section breaks.' },
    { allowed: false, rule: 'Never use patterns on small UI elements like buttons or badges.' },
    { allowed: false, rule: 'Never stack multiple pattern types in the same view.' },
  ];
}
