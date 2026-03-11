import { Component } from '@angular/core';

@Component({
  selector: 'app-style-guide-components',
  standalone: true,
  template: `
    <h1 class="text-3xl font-extrabold text-surface-900 tracking-tight mb-2">Components</h1>
    <p class="text-surface-500 mb-10 max-w-2xl">
      Illustrative examples of how the theme colors, typography, and design principles come together in common UI
      patterns.
    </p>

    <!-- Buttons -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-2">Buttons</h2>
      <p class="text-sm text-surface-500 mb-6">Primary, secondary, and workout-type variants.</p>

      <div class="space-y-6">
        <!-- Primary & Secondary -->
        <div class="rounded-xl border border-surface-200 bg-white p-6">
          <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">Primary & Secondary</p>
          <div class="flex flex-wrap items-center gap-3">
            <button
              class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
            >
              Create Workout
            </button>
            <button
              class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg border-2 border-primary-500 text-primary-600 hover:bg-primary-50 transition-colors"
            >
              View History
            </button>
            <button
              class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-surface-100 text-surface-700 hover:bg-surface-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        <!-- Workout Type Buttons -->
        <div class="rounded-xl border border-surface-200 bg-white p-6">
          <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">Workout Type Variants</p>
          <div class="flex flex-wrap items-center gap-3">
            <button
              class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
            >
              Conditioning
            </button>
            <button
              class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition-colors"
            >
              Hypertrophy
            </button>
            <button
              class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors"
            >
              Strength
            </button>
          </div>
        </div>

        <!-- Sizes -->
        <div class="rounded-xl border border-surface-200 bg-white p-6">
          <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">Sizes</p>
          <div class="flex flex-wrap items-end gap-3">
            <button
              class="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-md bg-primary-500 text-white"
            >
              Small
            </button>
            <button
              class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-primary-500 text-white"
            >
              Default
            </button>
            <button
              class="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-xl bg-primary-500 text-white"
            >
              Large
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Badges / Pills -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-2">Badges</h2>
      <p class="text-sm text-surface-500 mb-6">Used to identify workout types at a glance.</p>

      <div class="rounded-xl border border-surface-200 bg-white p-6">
        <div class="space-y-4">
          <!-- Filled -->
          <div>
            <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Filled</p>
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-cyan-500 text-white">
                Conditioning
              </span>
              <span class="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-violet-500 text-white">
                Hypertrophy
              </span>
              <span class="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-rose-500 text-white">
                Strength
              </span>
            </div>
          </div>

          <!-- Soft -->
          <div>
            <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Soft</p>
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-cyan-100 text-cyan-700">
                Conditioning
              </span>
              <span
                class="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-violet-100 text-violet-700"
              >
                Hypertrophy
              </span>
              <span class="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-700">
                Strength
              </span>
            </div>
          </div>

          <!-- Outline -->
          <div>
            <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Outline</p>
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border-2 border-cyan-400 text-cyan-600"
              >
                Conditioning
              </span>
              <span
                class="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border-2 border-violet-400 text-violet-600"
              >
                Hypertrophy
              </span>
              <span
                class="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border-2 border-rose-400 text-rose-600"
              >
                Strength
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Cards -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-2">Cards</h2>
      <p class="text-sm text-surface-500 mb-6">Content containers with workout-type accent variations.</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <!-- Conditioning Card -->
        <div class="rounded-xl bg-white border border-surface-200 overflow-hidden">
          <div class="h-2 bg-cyan-500"></div>
          <div class="p-5">
            <span
              class="inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-full bg-cyan-100 text-cyan-700 mb-3"
            >
              Conditioning
            </span>
            <h3 class="text-lg font-bold text-surface-900 mb-1">Tabata Sprints</h3>
            <p class="text-sm text-surface-500 mb-4">
              20s on / 10s off intervals targeting full-body cardio endurance.
            </p>
            <div class="flex items-center gap-3 text-xs text-surface-400">
              <span>8 rounds</span>
              <span class="text-surface-300">&middot;</span>
              <span>20 min</span>
            </div>
          </div>
        </div>

        <!-- Hypertrophy Card -->
        <div class="rounded-xl bg-white border border-surface-200 overflow-hidden">
          <div class="h-2 bg-violet-500"></div>
          <div class="p-5">
            <span
              class="inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-full bg-violet-100 text-violet-700 mb-3"
            >
              Hypertrophy
            </span>
            <h3 class="text-lg font-bold text-surface-900 mb-1">Upper Body Volume</h3>
            <p class="text-sm text-surface-500 mb-4">
              Chest, shoulders, and triceps with controlled tempo and high volume.
            </p>
            <div class="flex items-center gap-3 text-xs text-surface-400">
              <span>6 exercises</span>
              <span class="text-surface-300">&middot;</span>
              <span>45 min</span>
            </div>
          </div>
        </div>

        <!-- Strength Card -->
        <div class="rounded-xl bg-white border border-surface-200 overflow-hidden">
          <div class="h-2 bg-rose-500"></div>
          <div class="p-5">
            <span
              class="inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-full bg-rose-100 text-rose-700 mb-3"
            >
              Strength
            </span>
            <h3 class="text-lg font-bold text-surface-900 mb-1">Heavy Deadlift Day</h3>
            <p class="text-sm text-surface-500 mb-4">
              Progressive overload focused on posterior chain compound movements.
            </p>
            <div class="flex items-center gap-3 text-xs text-surface-400">
              <span>4 exercises</span>
              <span class="text-surface-300">&middot;</span>
              <span>50 min</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Composition Example -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-2">Composition</h2>
      <p class="text-sm text-surface-500 mb-6">A more complete example showing how elements combine.</p>

      <div class="rounded-2xl bg-white border border-surface-200 overflow-hidden">
        <!-- Header gradient -->
        <div class="bg-linear-to-r from-violet-500 to-violet-600 px-6 py-5">
          <div class="flex items-center justify-between">
            <div>
              <span
                class="inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-full bg-white/20 text-white mb-2"
              >
                Hypertrophy
              </span>
              <h3 class="text-xl font-extrabold text-white">Push Day — Chest & Shoulders</h3>
            </div>
            <span class="text-sm font-semibold text-white/70">45 min</span>
          </div>
        </div>

        <!-- Exercise list -->
        <div class="divide-y divide-surface-100">
          @for (exercise of sampleExercises; track exercise.name) {
            <div class="flex items-center justify-between px-6 py-4">
              <div>
                <p class="text-sm font-semibold text-surface-900">{{ exercise.name }}</p>
                <p class="text-xs text-surface-400">{{ exercise.detail }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-violet-600">{{ exercise.sets }}</p>
              </div>
            </div>
          }
        </div>

        <!-- Footer -->
        <div class="bg-surface-50 px-6 py-4 flex items-center justify-between">
          <span class="text-xs text-surface-400">AI-generated workout</span>
          <button
            class="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition-colors"
          >
            Start Workout
          </button>
        </div>
      </div>
    </section>
  `,
  host: {
    class: 'block',
  },
})
export class StyleGuideComponentsComponent {
  readonly sampleExercises = [
    { name: 'Barbell Bench Press', detail: 'Flat bench, controlled tempo', sets: '4 x 8-10' },
    { name: 'Incline Dumbbell Press', detail: '30\u00B0 incline, full ROM', sets: '3 x 10-12' },
    { name: 'Cable Flyes', detail: 'High to low, squeeze at peak', sets: '3 x 12-15' },
    { name: 'Overhead Press', detail: 'Standing, strict form', sets: '4 x 8-10' },
    { name: 'Lateral Raises', detail: 'Controlled eccentric', sets: '3 x 15-20' },
  ];
}
