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
      A bold, energetic palette anchored by sunshine orange with distinct workout-type colors that are vibrant and
      cohesive.
    </p>

    @for (scale of colorScales; track scale.name) {
      <section class="mb-12">
        <div class="mb-4">
          <h2 class="text-xl font-bold text-surface-900">{{ scale.name }}</h2>
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
  readonly colorScales: ColorScale[] = [
    {
      name: 'Primary — Sunshine Orange',
      description: 'The core brand color. Used for primary actions, key UI accents, and brand identity.',
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
      name: 'Conditioning — Bright Cyan',
      description: 'Represents cardio and endurance workouts. Energetic, fluid, and movement-oriented.',
      swatches: [
        { shade: '50', hex: '#ECFEFF', class: 'bg-conditioning-50', textClass: 'text-surface-900' },
        { shade: '100', hex: '#CFFAFE', class: 'bg-conditioning-100', textClass: 'text-surface-900' },
        { shade: '200', hex: '#A5F3FC', class: 'bg-conditioning-200', textClass: 'text-surface-900' },
        { shade: '300', hex: '#67E8F9', class: 'bg-conditioning-300', textClass: 'text-surface-900' },
        { shade: '400', hex: '#22D3EE', class: 'bg-conditioning-400', textClass: 'text-surface-900' },
        { shade: '500', hex: '#06B6D4', class: 'bg-conditioning-500', textClass: 'text-white' },
        { shade: '600', hex: '#0891B2', class: 'bg-conditioning-600', textClass: 'text-white' },
        { shade: '700', hex: '#0E7490', class: 'bg-conditioning-700', textClass: 'text-white' },
        { shade: '800', hex: '#155E75', class: 'bg-conditioning-800', textClass: 'text-white' },
        { shade: '900', hex: '#164E63', class: 'bg-conditioning-900', textClass: 'text-white' },
        { shade: '950', hex: '#083344', class: 'bg-conditioning-950', textClass: 'text-white' },
      ],
    },
    {
      name: 'Hypertrophy — Vivid Violet',
      description: 'Represents muscle growth workouts. Bold, creative, and distinctive.',
      swatches: [
        { shade: '50', hex: '#F5F3FF', class: 'bg-hypertrophy-50', textClass: 'text-surface-900' },
        { shade: '100', hex: '#EDE9FE', class: 'bg-hypertrophy-100', textClass: 'text-surface-900' },
        { shade: '200', hex: '#DDD6FE', class: 'bg-hypertrophy-200', textClass: 'text-surface-900' },
        { shade: '300', hex: '#C4B5FD', class: 'bg-hypertrophy-300', textClass: 'text-surface-900' },
        { shade: '400', hex: '#A78BFA', class: 'bg-hypertrophy-400', textClass: 'text-surface-900' },
        { shade: '500', hex: '#8B5CF6', class: 'bg-hypertrophy-500', textClass: 'text-white' },
        { shade: '600', hex: '#7C3AED', class: 'bg-hypertrophy-600', textClass: 'text-white' },
        { shade: '700', hex: '#6D28D9', class: 'bg-hypertrophy-700', textClass: 'text-white' },
        { shade: '800', hex: '#5B21B6', class: 'bg-hypertrophy-800', textClass: 'text-white' },
        { shade: '900', hex: '#4C1D95', class: 'bg-hypertrophy-900', textClass: 'text-white' },
        { shade: '950', hex: '#2E1065', class: 'bg-hypertrophy-950', textClass: 'text-white' },
      ],
    },
    {
      name: 'Strength — Bold Rose',
      description: 'Represents max power workouts. Intense and commanding, yet approachable.',
      swatches: [
        { shade: '50', hex: '#FFF1F2', class: 'bg-strength-50', textClass: 'text-surface-900' },
        { shade: '100', hex: '#FFE4E6', class: 'bg-strength-100', textClass: 'text-surface-900' },
        { shade: '200', hex: '#FECDD3', class: 'bg-strength-200', textClass: 'text-surface-900' },
        { shade: '300', hex: '#FDA4AF', class: 'bg-strength-300', textClass: 'text-surface-900' },
        { shade: '400', hex: '#FB7185', class: 'bg-strength-400', textClass: 'text-surface-900' },
        { shade: '500', hex: '#F43F5E', class: 'bg-strength-500', textClass: 'text-white' },
        { shade: '600', hex: '#E11D48', class: 'bg-strength-600', textClass: 'text-white' },
        { shade: '700', hex: '#BE123C', class: 'bg-strength-700', textClass: 'text-white' },
        { shade: '800', hex: '#9F1239', class: 'bg-strength-800', textClass: 'text-white' },
        { shade: '900', hex: '#881337', class: 'bg-strength-900', textClass: 'text-white' },
        { shade: '950', hex: '#4C0519', class: 'bg-strength-950', textClass: 'text-white' },
      ],
    },
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
      swatchClass: 'bg-conditioning-500',
      description:
        'Always use the designated color for each workout type. This consistency helps users instantly identify the training modality.',
    },
    {
      title: 'Text on Color',
      swatchClass: 'bg-surface-900',
      description:
        'Use white text on shades 500 and darker. Use surface-900 text on shades 400 and lighter to ensure accessibility.',
    },
  ];
}
