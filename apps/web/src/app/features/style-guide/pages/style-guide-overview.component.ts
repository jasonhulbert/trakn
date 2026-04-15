import { Component } from '@angular/core';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { UiPatternHeroComponent } from '../../../shared/components/ui';

@Component({
  selector: 'app-style-guide-overview',
  standalone: true,
  imports: [IconComponent, UiPatternHeroComponent],
  template: `
    <!-- Hero -->
    <div class="relative rounded-2xl bg-base-900 border border-base-700 p-10 md:p-14 mb-12 overflow-hidden">
      <ui-pattern-hero class="absolute inset-0 opacity-10" />
      <div class="relative z-10">
        <h1 class="text-4xl md:text-5xl font-extrabold text-fore-300 tracking-tight mb-4">Trakn Design System</h1>
        <p class="text-lg md:text-xl text-fore-600 max-w-2xl leading-relaxed">
          A stark, minimal dark aesthetic. Almost-black surfaces, linen-white type, brand orange reserved for moments that matter.
        </p>
      </div>
    </div>

    <!-- Principles -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-fore-300 mb-6">Design Principles</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        @for (principle of principles; track principle.title) {
          <div class="rounded-xl border border-base-700 bg-base-800 p-6">
            <div class="text-3xl mb-3"><app-icon [name]="principle.icon" class="w-8 h-8 text-accent-500" /></div>
            <h3 class="text-lg font-bold text-fore-300 mb-2">{{ principle.title }}</h3>
            <p class="text-sm text-fore-600 leading-relaxed">{{ principle.description }}</p>
          </div>
        }
      </div>
    </section>

    <!-- Workout Types -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-fore-300 mb-6">Three Patterns</h2>
      <p class="text-fore-600 mb-6 max-w-2xl">
        Workout types are differentiated by geometric pattern, not color. Each type has a distinct visual texture
        rendered on dark surfaces, keeping the palette unified while providing clear identity.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="rounded-xl bg-base-800 border border-base-700 p-6">
          <p class="text-sm font-semibold uppercase tracking-wider text-fore-600 mb-1">Conditioning</p>
          <p class="text-2xl font-extrabold text-fore-300">Concentric Waves</p>
        </div>
        <div class="rounded-xl bg-base-800 border border-base-700 p-6">
          <p class="text-sm font-semibold uppercase tracking-wider text-fore-600 mb-1">Hypertrophy</p>
          <p class="text-2xl font-extrabold text-fore-300">Concentric Circles</p>
        </div>
        <div class="rounded-xl bg-base-800 border border-base-700 p-6">
          <p class="text-sm font-semibold uppercase tracking-wider text-fore-600 mb-1">Strength</p>
          <p class="text-2xl font-extrabold text-fore-300">Grid Lines</p>
        </div>
      </div>
    </section>

    <!-- Quick Reference -->
    <section>
      <h2 class="text-2xl font-bold text-fore-300 mb-6">At a Glance</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="rounded-xl border border-base-700 bg-base-800 p-6">
          <h3 class="text-sm font-semibold text-fore-700 uppercase tracking-wider mb-3">Primary Font</h3>
          <p class="text-3xl font-extrabold text-fore-300">Plus Jakarta Sans</p>
          <p class="text-sm text-fore-600 mt-2">Weights 400 &ndash; 800 &middot; Modern, geometric, approachable</p>
        </div>
        <div class="rounded-xl border border-base-700 bg-base-800 p-6">
          <h3 class="text-sm font-semibold text-fore-700 uppercase tracking-wider mb-3">Brand Orange</h3>
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl bg-accent-500"></div>
            <div>
              <p class="text-lg font-bold text-fore-300">Brand Orange</p>
              <p class="text-sm text-fore-600 font-mono">#FF9500</p>
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
      icon: 'flash',
      title: 'Stark & Minimal',
      description:
        'Dark backgrounds, sparing use of accent color, nothing decorative. Every element earns its place against the void.',
    },
    {
      icon: 'peace-hand',
      title: 'Pattern-Driven',
      description:
        'Geometric patterns differentiate workout types instead of colors. Waves, circles, and grids provide identity without breaking the monochrome palette.',
    },
    {
      icon: 'sparks',
      title: 'Purposeful Contrast',
      description:
        'High contrast between the almost-black base and linen-white foreground. Orange accent appears only where it commands attention.',
    },
  ];
}
