import { Component } from '@angular/core';

interface ColorSwatch {
  shade: string;
  hex: string;
  class: string;
  textClass: string;
}

interface ColorScale {
  name: string;
  description: string;
  swatches: ColorSwatch[];
}

@Component({
  selector: 'app-style-guide-colors',
  standalone: true,
  template: `
    <h1 class="text-3xl font-extrabold text-surface-900 tracking-tight mb-2">Colors</h1>
    <p class="text-surface-500 mb-10 max-w-2xl">
      A bold, energetic palette anchored by sunshine orange. Workout types each have a dedicated color scale; utility
      scales cover semantic states like success, warning, danger, and info.
    </p>

    <h2 class="text-2xl font-bold text-surface-900 mb-2">Brand & Workout Types</h2>
    <p class="text-sm text-surface-500 mb-8">Core palette — primary brand color and the three workout-type colors.</p>

    @for (scale of brandScales; track scale.name) {
      <section class="mb-12">
        <div class="mb-4">
          <h3 class="text-lg font-bold text-surface-900">{{ scale.name }}</h3>
          <p class="text-sm text-surface-500">{{ scale.description }}</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-2">
          @for (swatch of scale.swatches; track swatch.shade) {
            <div class="flex flex-col">
              <div class="h-16 rounded-lg mb-1.5" [class]="swatch.class"></div>
              <span class="text-xs font-semibold text-surface-700">{{ swatch.shade }}</span>
              <span class="text-xs font-mono text-surface-400">{{ swatch.hex }}</span>
            </div>
          }
        </div>
      </section>
    }

    <h2 class="text-2xl font-bold text-surface-900 mb-2 mt-4">Utility Colors</h2>
    <p class="text-sm text-surface-500 mb-8">
      Semantic scales for status communication — danger, success, warning, and info.
    </p>

    @for (scale of utilityScales; track scale.name) {
      <section class="mb-12">
        <div class="mb-4">
          <h3 class="text-lg font-bold text-surface-900">{{ scale.name }}</h3>
          <p class="text-sm text-surface-500">{{ scale.description }}</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-2">
          @for (swatch of scale.swatches; track swatch.shade) {
            <div class="flex flex-col">
              <div class="h-16 rounded-lg mb-1.5" [class]="swatch.class"></div>
              <span class="text-xs font-semibold text-surface-700">{{ swatch.shade }}</span>
              <span class="text-xs font-mono text-surface-400">{{ swatch.hex }}</span>
            </div>
          }
        </div>
      </section>
    }

    <h2 class="text-2xl font-bold text-surface-900 mb-2 mt-4">Neutrals</h2>
    <p class="text-sm text-surface-500 mb-8">Warm stone-toned neutrals used for backgrounds, borders, and text.</p>

    @for (scale of neutralScales; track scale.name) {
      <section class="mb-12">
        <div class="mb-4">
          <h3 class="text-lg font-bold text-surface-900">{{ scale.name }}</h3>
          <p class="text-sm text-surface-500">{{ scale.description }}</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-2">
          @for (swatch of scale.swatches; track swatch.shade) {
            <div class="flex flex-col">
              <div class="h-16 rounded-lg mb-1.5" [class]="swatch.class"></div>
              <span class="text-xs font-semibold text-surface-700">{{ swatch.shade }}</span>
              <span class="text-xs font-mono text-surface-400">{{ swatch.hex }}</span>
            </div>
          }
        </div>
      </section>
    }

    <!-- Usage guidance -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-4">Usage Guidelines</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (guideline of usageGuidelines; track guideline.title) {
          <div class="rounded-xl border border-surface-200 bg-white p-5">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-8 h-8 rounded-lg" [class]="guideline.swatchClass"></div>
              <h3 class="text-sm font-bold text-surface-900">{{ guideline.title }}</h3>
            </div>
            <p class="text-sm text-surface-500 leading-relaxed">{{ guideline.description }}</p>
          </div>
        }
      </div>
    </section>
  `,
  host: {
    class: 'block',
  },
})
export class StyleGuideColorsComponent {
  readonly brandScales: ColorScale[] = [
    {
      name: 'Primary — Sunshine Orange',
      description: 'Core brand color. Used for primary actions, key UI accents, and brand identity.',
      swatches: [
        { shade: '50', hex: '#FFF8EB', class: 'bg-primary-50', textClass: 'text-surface-900' },
        { shade: '100', hex: '#FFEFC6', class: 'bg-primary-100', textClass: 'text-surface-900' },
        { shade: '200', hex: '#FFDB88', class: 'bg-primary-200', textClass: 'text-surface-900' },
        { shade: '300', hex: '#FFC44A', class: 'bg-primary-300', textClass: 'text-surface-900' },
        { shade: '400', hex: '#FFAD1F', class: 'bg-primary-400', textClass: 'text-surface-900' },
        { shade: '500', hex: '#FF9500', class: 'bg-primary-500', textClass: 'text-white' },
        { shade: '600', hex: '#E07400', class: 'bg-primary-600', textClass: 'text-white' },
        { shade: '700', hex: '#B85500', class: 'bg-primary-700', textClass: 'text-white' },
        { shade: '800', hex: '#944010', class: 'bg-primary-800', textClass: 'text-white' },
        { shade: '900', hex: '#7A3510', class: 'bg-primary-900', textClass: 'text-white' },
        { shade: '950', hex: '#461A04', class: 'bg-primary-950', textClass: 'text-white' },
      ],
    },
    {
      name: 'Cyan — Conditioning',
      description: 'Bright, energetic cyan used for conditioning (cardio & endurance) workouts.',
      swatches: [
        { shade: '50', hex: '#ECFEFF', class: 'bg-cyan-50', textClass: 'text-surface-900' },
        { shade: '100', hex: '#CFFAFE', class: 'bg-cyan-100', textClass: 'text-surface-900' },
        { shade: '200', hex: '#A5F3FC', class: 'bg-cyan-200', textClass: 'text-surface-900' },
        { shade: '300', hex: '#67E8F9', class: 'bg-cyan-300', textClass: 'text-surface-900' },
        { shade: '400', hex: '#22D3EE', class: 'bg-cyan-400', textClass: 'text-surface-900' },
        { shade: '500', hex: '#06B6D4', class: 'bg-cyan-500', textClass: 'text-white' },
        { shade: '600', hex: '#0891B2', class: 'bg-cyan-600', textClass: 'text-white' },
        { shade: '700', hex: '#0E7490', class: 'bg-cyan-700', textClass: 'text-white' },
        { shade: '800', hex: '#155E75', class: 'bg-cyan-800', textClass: 'text-white' },
        { shade: '900', hex: '#164E63', class: 'bg-cyan-900', textClass: 'text-white' },
        { shade: '950', hex: '#083344', class: 'bg-cyan-950', textClass: 'text-white' },
      ],
    },
    {
      name: 'Violet — Hypertrophy',
      description: 'Vivid violet used for hypertrophy (muscle growth) workouts.',
      swatches: [
        { shade: '50', hex: '#F5F3FF', class: 'bg-violet-50', textClass: 'text-surface-900' },
        { shade: '100', hex: '#EDE9FE', class: 'bg-violet-100', textClass: 'text-surface-900' },
        { shade: '200', hex: '#DDD6FE', class: 'bg-violet-200', textClass: 'text-surface-900' },
        { shade: '300', hex: '#C4B5FD', class: 'bg-violet-300', textClass: 'text-surface-900' },
        { shade: '400', hex: '#A78BFA', class: 'bg-violet-400', textClass: 'text-surface-900' },
        { shade: '500', hex: '#8B5CF6', class: 'bg-violet-500', textClass: 'text-white' },
        { shade: '600', hex: '#7C3AED', class: 'bg-violet-600', textClass: 'text-white' },
        { shade: '700', hex: '#6D28D9', class: 'bg-violet-700', textClass: 'text-white' },
        { shade: '800', hex: '#5B21B6', class: 'bg-violet-800', textClass: 'text-white' },
        { shade: '900', hex: '#4C1D95', class: 'bg-violet-900', textClass: 'text-white' },
        { shade: '950', hex: '#2E1065', class: 'bg-violet-950', textClass: 'text-white' },
      ],
    },
    {
      name: 'Rose — Strength',
      description:
        'Cool pink-rose used for strength (max power) workouts. Slightly cooler than danger to distinguish the two.',
      swatches: [
        { shade: '50', hex: '#FFF0F5', class: 'bg-rose-50', textClass: 'text-surface-900' },
        { shade: '100', hex: '#FFE1EC', class: 'bg-rose-100', textClass: 'text-surface-900' },
        { shade: '200', hex: '#FFC2D8', class: 'bg-rose-200', textClass: 'text-surface-900' },
        { shade: '300', hex: '#FF8CB8', class: 'bg-rose-300', textClass: 'text-surface-900' },
        { shade: '400', hex: '#F8569A', class: 'bg-rose-400', textClass: 'text-surface-900' },
        { shade: '500', hex: '#F0347A', class: 'bg-rose-500', textClass: 'text-white' },
        { shade: '600', hex: '#D4186A', class: 'bg-rose-600', textClass: 'text-white' },
        { shade: '700', hex: '#B00F55', class: 'bg-rose-700', textClass: 'text-white' },
        { shade: '800', hex: '#910F44', class: 'bg-rose-800', textClass: 'text-white' },
        { shade: '900', hex: '#7A1039', class: 'bg-rose-900', textClass: 'text-white' },
        { shade: '950', hex: '#47051F', class: 'bg-rose-950', textClass: 'text-white' },
      ],
    },
  ];

  readonly utilityScales: ColorScale[] = [
    {
      name: 'Danger — Warm Red',
      description: 'Warm orange-tinted red for errors, destructive actions, and critical states.',
      swatches: [
        { shade: '50', hex: '#FFF4F2', class: 'bg-danger-50', textClass: 'text-surface-900' },
        { shade: '100', hex: '#FFE5E0', class: 'bg-danger-100', textClass: 'text-surface-900' },
        { shade: '200', hex: '#FFC5BC', class: 'bg-danger-200', textClass: 'text-surface-900' },
        { shade: '300', hex: '#FF9585', class: 'bg-danger-300', textClass: 'text-surface-900' },
        { shade: '400', hex: '#FF5E4B', class: 'bg-danger-400', textClass: 'text-surface-900' },
        { shade: '500', hex: '#E63A24', class: 'bg-danger-500', textClass: 'text-white' },
        { shade: '600', hex: '#C22B18', class: 'bg-danger-600', textClass: 'text-white' },
        { shade: '700', hex: '#9E2012', class: 'bg-danger-700', textClass: 'text-white' },
        { shade: '800', hex: '#831C10', class: 'bg-danger-800', textClass: 'text-white' },
        { shade: '900', hex: '#6E1A10', class: 'bg-danger-900', textClass: 'text-white' },
        { shade: '950', hex: '#3C0906', class: 'bg-danger-950', textClass: 'text-white' },
      ],
    },
    {
      name: 'Success — Green',
      description: 'Green for positive confirmations, completed states, and successful outcomes.',
      swatches: [
        { shade: '50', hex: '#F0FDF4', class: 'bg-success-50', textClass: 'text-surface-900' },
        { shade: '100', hex: '#DCFCE7', class: 'bg-success-100', textClass: 'text-surface-900' },
        { shade: '200', hex: '#BBF7D0', class: 'bg-success-200', textClass: 'text-surface-900' },
        { shade: '300', hex: '#86EFAC', class: 'bg-success-300', textClass: 'text-surface-900' },
        { shade: '400', hex: '#4ADE80', class: 'bg-success-400', textClass: 'text-surface-900' },
        { shade: '500', hex: '#22C55E', class: 'bg-success-500', textClass: 'text-white' },
        { shade: '600', hex: '#16A34A', class: 'bg-success-600', textClass: 'text-white' },
        { shade: '700', hex: '#15803D', class: 'bg-success-700', textClass: 'text-white' },
        { shade: '800', hex: '#166534', class: 'bg-success-800', textClass: 'text-white' },
        { shade: '900', hex: '#14532D', class: 'bg-success-900', textClass: 'text-white' },
        { shade: '950', hex: '#052E16', class: 'bg-success-950', textClass: 'text-white' },
      ],
    },
    {
      name: 'Warning — Amber',
      description: 'Amber for cautionary messages, advisory states, and non-blocking alerts.',
      swatches: [
        { shade: '50', hex: '#FFFBEB', class: 'bg-warning-50', textClass: 'text-surface-900' },
        { shade: '100', hex: '#FEF3C7', class: 'bg-warning-100', textClass: 'text-surface-900' },
        { shade: '200', hex: '#FDE68A', class: 'bg-warning-200', textClass: 'text-surface-900' },
        { shade: '300', hex: '#FCD34D', class: 'bg-warning-300', textClass: 'text-surface-900' },
        { shade: '400', hex: '#FBBF24', class: 'bg-warning-400', textClass: 'text-surface-900' },
        { shade: '500', hex: '#F59E0B', class: 'bg-warning-500', textClass: 'text-white' },
        { shade: '600', hex: '#D97706', class: 'bg-warning-600', textClass: 'text-white' },
        { shade: '700', hex: '#B45309', class: 'bg-warning-700', textClass: 'text-white' },
        { shade: '800', hex: '#92400E', class: 'bg-warning-800', textClass: 'text-white' },
        { shade: '900', hex: '#78350F', class: 'bg-warning-900', textClass: 'text-white' },
        { shade: '950', hex: '#451A03', class: 'bg-warning-950', textClass: 'text-white' },
      ],
    },
    {
      name: 'Info — Blue',
      description: 'Blue for informational messages, hints, and neutral status indicators.',
      swatches: [
        { shade: '50', hex: '#EFF6FF', class: 'bg-info-50', textClass: 'text-surface-900' },
        { shade: '100', hex: '#DBEAFE', class: 'bg-info-100', textClass: 'text-surface-900' },
        { shade: '200', hex: '#BFDBFE', class: 'bg-info-200', textClass: 'text-surface-900' },
        { shade: '300', hex: '#93C5FD', class: 'bg-info-300', textClass: 'text-surface-900' },
        { shade: '400', hex: '#60A5FA', class: 'bg-info-400', textClass: 'text-surface-900' },
        { shade: '500', hex: '#3B82F6', class: 'bg-info-500', textClass: 'text-white' },
        { shade: '600', hex: '#2563EB', class: 'bg-info-600', textClass: 'text-white' },
        { shade: '700', hex: '#1D4ED8', class: 'bg-info-700', textClass: 'text-white' },
        { shade: '800', hex: '#1E40AF', class: 'bg-info-800', textClass: 'text-white' },
        { shade: '900', hex: '#1E3A8A', class: 'bg-info-900', textClass: 'text-white' },
        { shade: '950', hex: '#172554', class: 'bg-info-950', textClass: 'text-white' },
      ],
    },
  ];

  readonly neutralScales: ColorScale[] = [
    {
      name: 'Surface — Warm Neutrals',
      description: 'Background and text colors with a warm stone undertone that complements the orange primary.',
      swatches: [
        { shade: '50', hex: '#FAFAF9', class: 'bg-surface-50', textClass: 'text-surface-900' },
        { shade: '100', hex: '#F5F5F4', class: 'bg-surface-100', textClass: 'text-surface-900' },
        { shade: '200', hex: '#E7E5E4', class: 'bg-surface-200', textClass: 'text-surface-900' },
        { shade: '300', hex: '#D6D3D1', class: 'bg-surface-300', textClass: 'text-surface-900' },
        { shade: '400', hex: '#A8A29E', class: 'bg-surface-400', textClass: 'text-surface-900' },
        { shade: '500', hex: '#78716C', class: 'bg-surface-500', textClass: 'text-white' },
        { shade: '600', hex: '#57534E', class: 'bg-surface-600', textClass: 'text-white' },
        { shade: '700', hex: '#44403C', class: 'bg-surface-700', textClass: 'text-white' },
        { shade: '800', hex: '#292524', class: 'bg-surface-800', textClass: 'text-white' },
        { shade: '900', hex: '#1C1917', class: 'bg-surface-900', textClass: 'text-white' },
        { shade: '950', hex: '#0C0A09', class: 'bg-surface-950', textClass: 'text-white' },
      ],
    },
  ];

  readonly usageGuidelines = [
    {
      title: 'Primary Actions',
      swatchClass: 'bg-primary-500',
      description:
        'Use primary-500 for buttons, links, and interactive elements that represent the main action. Use primary-600 for hover states.',
    },
    {
      title: 'Subtle Backgrounds',
      swatchClass: 'bg-primary-50',
      description:
        'Use the 50 shade of any color for tinted backgrounds — callout boxes, selected states, or status indicators.',
    },
    {
      title: 'Workout Type Identification',
      swatchClass: 'bg-cyan-500',
      description:
        'Always use the designated color scale for each workout type: cyan for conditioning, violet for hypertrophy, rose for strength.',
    },
    {
      title: 'Semantic States',
      swatchClass: 'bg-danger-500',
      description:
        'Use danger, success, warning, and info scales exclusively for status communication. Do not use them as decorative colors.',
    },
    {
      title: 'Text on Color',
      swatchClass: 'bg-surface-900',
      description:
        'Use white text on shades 500 and darker. Use surface-900 text on shades 400 and lighter to ensure accessibility.',
    },
  ];
}
