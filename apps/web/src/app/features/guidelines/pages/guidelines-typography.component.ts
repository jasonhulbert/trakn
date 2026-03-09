import { Component } from '@angular/core';

@Component({
  selector: 'app-guidelines-typography',
  standalone: true,
  template: `
    <h1 class="text-3xl font-extrabold text-surface-900 tracking-tight mb-2">Typography</h1>
    <p class="text-surface-500 mb-10 max-w-2xl">
      Plus Jakarta Sans is the sole typeface — modern, geometric, and approachable across all weights and sizes.
    </p>

    <!-- Font Family -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-4">Font Family</h2>
      <div class="rounded-xl border border-surface-200 bg-white p-6">
        <p class="text-4xl font-extrabold text-surface-900 mb-2">Plus Jakarta Sans</p>
        <p class="text-sm text-surface-400 font-mono mb-4">'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif</p>
        <p class="text-surface-600 leading-relaxed">
          ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
          abcdefghijklmnopqrstuvwxyz<br />
          0123456789 !&#64;#$%^&amp;*()
        </p>
      </div>
    </section>

    <!-- Weight Scale -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-4">Weight Scale</h2>
      <div class="space-y-0 rounded-xl border border-surface-200 bg-white overflow-hidden divide-y divide-surface-100">
        @for (weight of weights; track weight.value) {
          <div class="flex items-baseline gap-6 px-6 py-4">
            <span class="w-24 shrink-0 text-xs font-mono text-surface-400">{{ weight.value }}</span>
            <span class="w-28 shrink-0 text-sm text-surface-500">{{ weight.name }}</span>
            <span class="text-2xl text-surface-900" [style.font-weight]="weight.value">
              The quick brown fox jumps
            </span>
          </div>
        }
      </div>
    </section>

    <!-- Type Scale -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-4">Type Scale</h2>
      <div class="space-y-6">
        @for (level of typeScale; track level.name) {
          <div class="rounded-xl border border-surface-200 bg-white p-6">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-xs font-mono text-surface-400 bg-surface-100 px-2 py-0.5 rounded">
                {{ level.name }}
              </span>
              <span class="text-xs text-surface-400">
                {{ level.size }} &middot; {{ level.weight }} &middot; {{ level.tracking }}
              </span>
            </div>
            <p [class]="level.class">{{ level.sample }}</p>
          </div>
        }
      </div>
    </section>

    <!-- Hierarchy Example -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-4">Hierarchy in Practice</h2>
      <div class="rounded-xl border border-surface-200 bg-white p-8">
        <p class="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-2">Conditioning Workout</p>
        <h3 class="text-3xl font-extrabold text-surface-900 tracking-tight mb-3">30-Minute HIIT Session</h3>
        <p class="text-surface-600 leading-relaxed mb-4">
          High-intensity intervals designed to push your cardiovascular limits. Alternating between all-out effort and
          active recovery to maximize calorie burn and endurance.
        </p>
        <div class="flex items-center gap-4 text-sm">
          <span class="text-surface-400">8 exercises</span>
          <span class="text-surface-300">&middot;</span>
          <span class="text-surface-400">30 minutes</span>
          <span class="text-surface-300">&middot;</span>
          <span class="font-semibold text-conditioning-600">Intermediate</span>
        </div>
      </div>
    </section>
  `,
  host: {
    class: 'block',
  },
})
export class GuidelinesTypographyComponent {
  readonly weights = [
    { value: 400, name: 'Regular' },
    { value: 500, name: 'Medium' },
    { value: 600, name: 'SemiBold' },
    { value: 700, name: 'Bold' },
    { value: 800, name: 'ExtraBold' },
  ];

  readonly typeScale = [
    {
      name: 'Display',
      size: 'text-5xl (3rem)',
      weight: 'font-extrabold',
      tracking: 'tracking-tight',
      class: 'text-5xl font-extrabold text-surface-900 tracking-tight',
      sample: 'Start Your Workout',
    },
    {
      name: 'H1',
      size: 'text-4xl (2.25rem)',
      weight: 'font-extrabold',
      tracking: 'tracking-tight',
      class: 'text-4xl font-extrabold text-surface-900 tracking-tight',
      sample: "Today's Training Plan",
    },
    {
      name: 'H2',
      size: 'text-2xl (1.5rem)',
      weight: 'font-bold',
      tracking: 'normal',
      class: 'text-2xl font-bold text-surface-900',
      sample: 'Exercise Library',
    },
    {
      name: 'H3',
      size: 'text-xl (1.25rem)',
      weight: 'font-bold',
      tracking: 'normal',
      class: 'text-xl font-bold text-surface-900',
      sample: 'Workout Summary',
    },
    {
      name: 'H4',
      size: 'text-lg (1.125rem)',
      weight: 'font-semibold',
      tracking: 'normal',
      class: 'text-lg font-semibold text-surface-900',
      sample: 'Set Details',
    },
    {
      name: 'Body',
      size: 'text-base (1rem)',
      weight: 'font-normal',
      tracking: 'normal',
      class: 'text-base font-normal text-surface-600 leading-relaxed',
      sample: 'Rest for 90 seconds between sets. Focus on controlled eccentric movement and full range of motion.',
    },
    {
      name: 'Small',
      size: 'text-sm (0.875rem)',
      weight: 'font-normal',
      tracking: 'normal',
      class: 'text-sm font-normal text-surface-500',
      sample: 'Last performed 3 days ago',
    },
    {
      name: 'Caption',
      size: 'text-xs (0.75rem)',
      weight: 'font-medium',
      tracking: 'tracking-wider uppercase',
      class: 'text-xs font-medium text-surface-400 uppercase tracking-wider',
      sample: 'Workout Type',
    },
  ];
}
