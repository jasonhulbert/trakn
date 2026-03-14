import { Component } from '@angular/core';
import {
  UiBadgeComponent,
  UiButtonDirective,
  UiCardAccentDirective,
  UiCardBodyDirective,
  UiCardComponent,
  UiCardFooterDirective,
  UiCardHeaderDirective,
} from '../../../shared/components/ui';

@Component({
  selector: 'app-style-guide-components',
  standalone: true,
  imports: [
    UiButtonDirective,
    UiBadgeComponent,
    UiCardComponent,
    UiCardAccentDirective,
    UiCardHeaderDirective,
    UiCardBodyDirective,
    UiCardFooterDirective,
  ],
  template: `
    <h1 class="text-3xl font-extrabold text-surface-900 tracking-tight mb-2">Components</h1>
    <p class="text-surface-500 mb-10 max-w-2xl">
      Live examples using the actual
      <code class="text-xs font-mono bg-surface-100 text-surface-700 px-1.5 py-0.5 rounded">ui-*</code>
      component library — demonstrating variants, colors, and composition patterns.
    </p>

    <!-- Buttons -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-2">Buttons</h2>
      <p class="text-sm text-surface-500 mb-6">
        Use
        <code class="text-xs font-mono bg-surface-100 text-surface-700 px-1.5 py-0.5 rounded">uiButton</code>
        with
        <code class="text-xs font-mono bg-surface-100 text-surface-700 px-1.5 py-0.5 rounded">variant</code>,
        <code class="text-xs font-mono bg-surface-100 text-surface-700 px-1.5 py-0.5 rounded">color</code>, and
        <code class="text-xs font-mono bg-surface-100 text-surface-700 px-1.5 py-0.5 rounded">size</code>
        inputs.
      </p>

      <div class="space-y-4">
        <!-- Variant -->
        <div class="rounded-xl border border-surface-200 bg-white p-6">
          <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">Variant</p>
          <div class="flex flex-wrap items-center gap-3">
            <button uiButton>Solid</button>
            <button uiButton variant="outline">Outline</button>
            <button uiButton variant="ghost">Ghost</button>
          </div>
        </div>

        <!-- Color -->
        <div class="rounded-xl border border-surface-200 bg-white p-6">
          <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">Color</p>
          <div class="flex flex-wrap items-center gap-3">
            <button uiButton color="primary">Primary</button>
            <button uiButton color="danger">Danger</button>
            <button uiButton color="cyan">Cyan</button>
            <button uiButton color="violet">Violet</button>
            <button uiButton color="rose">Rose</button>
            <button uiButton color="surface">Surface</button>
          </div>
        </div>

        <!-- Size -->
        <div class="rounded-xl border border-surface-200 bg-white p-6">
          <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">Size</p>
          <div class="flex flex-wrap items-end gap-3">
            <button uiButton size="sm">Small</button>
            <button uiButton size="md">Default</button>
            <button uiButton size="lg">Large</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Badges -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-2">Badges</h2>
      <p class="text-sm text-surface-500 mb-6">
        Use
        <code class="text-xs font-mono bg-surface-100 text-surface-700 px-1.5 py-0.5 rounded">ui-badge</code>
        with
        <code class="text-xs font-mono bg-surface-100 text-surface-700 px-1.5 py-0.5 rounded">variant</code>
        and
        <code class="text-xs font-mono bg-surface-100 text-surface-700 px-1.5 py-0.5 rounded">color</code>
        inputs.
      </p>

      <div class="rounded-xl border border-surface-200 bg-white p-6">
        <div class="space-y-6">
          @for (variant of badgeVariants; track variant.label) {
            <div>
              <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">{{ variant.label }}</p>
              <div class="flex flex-wrap items-center gap-2">
                @for (color of badgeColors; track color) {
                  <ui-badge [variant]="variant.value" [color]="color">{{ color }}</ui-badge>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Cards -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-2">Cards</h2>
      <p class="text-sm text-surface-500 mb-6">
        Combine
        <code class="text-xs font-mono bg-surface-100 text-surface-700 px-1.5 py-0.5 rounded">ui-card</code>
        with
        <code class="text-xs font-mono bg-surface-100 text-surface-700 px-1.5 py-0.5 rounded">uiCardAccent</code>,
        <code class="text-xs font-mono bg-surface-100 text-surface-700 px-1.5 py-0.5 rounded">uiCardHeader</code>,
        <code class="text-xs font-mono bg-surface-100 text-surface-700 px-1.5 py-0.5 rounded">uiCardBody</code>, and
        <code class="text-xs font-mono bg-surface-100 text-surface-700 px-1.5 py-0.5 rounded">uiCardFooter</code>.
      </p>

      <!-- Accent bar cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        @for (card of accentCards; track card.color) {
          <ui-card padding="none">
            <div uiCardAccent [color]="card.color"></div>
            <div uiCardBody>
              <ui-badge [color]="card.color" variant="soft" class="mb-3">{{ card.label }}</ui-badge>
              <h3 class="text-lg font-bold text-surface-900 mb-1">{{ card.title }}</h3>
              <p class="text-sm text-surface-500 mb-4">{{ card.description }}</p>
              <div class="flex items-center gap-3 text-xs text-surface-400">
                <span>{{ card.meta1 }}</span>
                <span class="text-surface-300">&middot;</span>
                <span>{{ card.meta2 }}</span>
              </div>
            </div>
          </ui-card>
        }
      </div>

      <!-- Variant reference -->
      <div class="rounded-xl border border-surface-200 bg-white p-6">
        <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">Card Variants</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          @for (v of cardVariants; track v.label) {
            <ui-card [variant]="v.value">
              <p class="text-xs font-semibold text-surface-700">{{ v.label }}</p>
              <p class="text-xs text-surface-400 mt-1">variant="{{ v.value }}"</p>
            </ui-card>
          }
        </div>
      </div>
    </section>

    <!-- Composition -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-2">Composition</h2>
      <p class="text-sm text-surface-500 mb-6">
        A composed card using
        <code class="text-xs font-mono bg-surface-100 text-surface-700 px-1.5 py-0.5 rounded">uiCardHeader[color]</code>
        for the gradient header and
        <code class="text-xs font-mono bg-surface-100 text-surface-700 px-1.5 py-0.5 rounded">uiCardFooter[muted]</code>
        for the action footer.
      </p>

      <ui-card padding="none">
        <!-- Gradient header -->
        <div uiCardHeader color="violet">
          <div>
            <ui-badge color="violet" variant="filled" class="mb-2 opacity-80">Hypertrophy</ui-badge>
            <h3 class="text-xl font-extrabold text-white">Push Day — Chest &amp; Shoulders</h3>
          </div>
          <span class="text-sm font-semibold text-white/70">45 min</span>
        </div>

        <!-- Exercise list -->
        <div class="divide-y divide-surface-100">
          @for (exercise of sampleExercises; track exercise.name) {
            <div class="flex items-center justify-between px-6 py-4">
              <div>
                <p class="text-sm font-semibold text-surface-900">{{ exercise.name }}</p>
                <p class="text-xs text-surface-400">{{ exercise.detail }}</p>
              </div>
              <p class="text-sm font-bold text-violet-600">{{ exercise.sets }}</p>
            </div>
          }
        </div>

        <!-- Muted footer -->
        <div uiCardFooter muted class="justify-between">
          <span class="text-xs text-surface-400">AI-generated workout</span>
          <button uiButton color="violet" size="sm">Start Workout</button>
        </div>
      </ui-card>
    </section>
  `,
  host: {
    class: 'block',
  },
})
export class StyleGuideComponentsComponent {
  readonly badgeVariants = [
    { label: 'Filled', value: 'filled' as const },
    { label: 'Soft', value: 'soft' as const },
    { label: 'Outline', value: 'outline' as const },
  ];

  readonly badgeColors = ['primary', 'cyan', 'violet', 'rose', 'success', 'danger', 'warning', 'info'] as const;

  readonly accentCards = [
    {
      color: 'cyan' as const,
      label: 'Conditioning',
      title: 'Tabata Sprints',
      description: '20s on / 10s off intervals targeting full-body cardio endurance.',
      meta1: '8 rounds',
      meta2: '20 min',
    },
    {
      color: 'violet' as const,
      label: 'Hypertrophy',
      title: 'Upper Body Volume',
      description: 'Chest, shoulders, and triceps with controlled tempo and high volume.',
      meta1: '6 exercises',
      meta2: '45 min',
    },
    {
      color: 'rose' as const,
      label: 'Strength',
      title: 'Heavy Deadlift Day',
      description: 'Progressive overload focused on posterior chain compound movements.',
      meta1: '4 exercises',
      meta2: '50 min',
    },
  ];

  readonly cardVariants = [
    { label: 'Default', value: 'default' as const },
    { label: 'Outline', value: 'outline' as const },
    { label: 'Elevated', value: 'elevated' as const },
    { label: 'Ghost', value: 'ghost' as const },
  ];

  readonly sampleExercises = [
    { name: 'Barbell Bench Press', detail: 'Flat bench, controlled tempo', sets: '4 × 8–10' },
    { name: 'Incline Dumbbell Press', detail: '30° incline, full ROM', sets: '3 × 10–12' },
    { name: 'Cable Flyes', detail: 'High to low, squeeze at peak', sets: '3 × 12–15' },
    { name: 'Overhead Press', detail: 'Standing, strict form', sets: '4 × 8–10' },
    { name: 'Lateral Raises', detail: 'Controlled eccentric', sets: '3 × 15–20' },
  ];
}
