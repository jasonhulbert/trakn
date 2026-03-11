import { Component } from '@angular/core';

@Component({
  selector: 'app-style-guide-overview',
  standalone: true,
  template: `
    <!-- Hero -->
    <div class="rounded-2xl bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 p-10 md:p-14 mb-12">
      <h1 class="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Trakn Design Guidelines</h1>
      <p class="text-lg md:text-xl text-primary-100 max-w-2xl leading-relaxed">
        A bold, vibrant, and approachable visual language for a fitness app that gets out of your way.
      </p>
    </div>

    <!-- Principles -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-surface-900 mb-6">Design Principles</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        @for (principle of principles; track principle.title) {
          <div class="rounded-xl border border-surface-200 bg-white p-6">
            <div class="text-3xl mb-3">{{ principle.icon }}</div>
            <h3 class="text-lg font-bold text-surface-900 mb-2">{{ principle.title }}</h3>
            <p class="text-sm text-surface-500 leading-relaxed">{{ principle.description }}</p>
          </div>
        }
      </div>
    </section>

    <!-- Workout Types -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-surface-900 mb-6">Three Workout Types, Three Colors</h2>
      <p class="text-surface-600 mb-6 max-w-2xl">
        Each workout type has its own distinct color, making it instantly recognizable throughout the application. The
        colors are bold and energetic while remaining visually cohesive.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="rounded-xl bg-conditioning-500 p-6 text-white">
          <p class="text-sm font-semibold uppercase tracking-wider opacity-80 mb-1">Conditioning</p>
          <p class="text-2xl font-extrabold">Cardio & Endurance</p>
        </div>
        <div class="rounded-xl bg-hypertrophy-500 p-6 text-white">
          <p class="text-sm font-semibold uppercase tracking-wider opacity-80 mb-1">Hypertrophy</p>
          <p class="text-2xl font-extrabold">Muscle Growth</p>
        </div>
        <div class="rounded-xl bg-strength-500 p-6 text-white">
          <p class="text-sm font-semibold uppercase tracking-wider opacity-80 mb-1">Strength</p>
          <p class="text-2xl font-extrabold">Max Power</p>
        </div>
      </div>
    </section>

    <!-- Quick Reference -->
    <section>
      <h2 class="text-2xl font-bold text-surface-900 mb-6">At a Glance</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="rounded-xl border border-surface-200 bg-white p-6">
          <h3 class="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-3">Primary Font</h3>
          <p class="text-3xl font-extrabold text-surface-900">Plus Jakarta Sans</p>
          <p class="text-sm text-surface-500 mt-2">Weights 400 &ndash; 800 &middot; Modern, geometric, approachable</p>
        </div>
        <div class="rounded-xl border border-surface-200 bg-white p-6">
          <h3 class="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-3">Primary Color</h3>
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl bg-primary-500"></div>
            <div>
              <p class="text-lg font-bold text-surface-900">Sunshine Orange</p>
              <p class="text-sm text-surface-500 font-mono">#FF9500</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  host: {
    class: 'block',
  },
})
export class StyleGuideOverviewComponent {
  readonly principles = [
    {
      icon: '\u26A1',
      title: 'Bold & Vibrant',
      description:
        'Strong colors, confident typography, and energetic visual treatments that reflect the energy of a great workout.',
    },
    {
      icon: '\uD83E\uDD1D',
      title: 'Approachable',
      description: 'Warm tones, friendly shapes, and clear hierarchy that welcome beginners and reduce intimidation.',
    },
    {
      icon: '\u2728',
      title: 'Minimal Friction',
      description: 'Clean layouts, generous spacing, and purposeful simplicity. Every element earns its place.',
    },
  ];
}
