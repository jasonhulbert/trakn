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
    <h1 class="text-3xl font-extrabold text-fore-300 tracking-tight mb-2">Colors</h1>
    <p class="text-fore-600 mb-10 max-w-2xl">
      A stark, constrained palette built on almost-black and linen-white. Four scales total — base, foreground, accent,
      and danger. Workout types are differentiated by pattern, not color.
    </p>

    <h2 class="text-2xl font-bold text-fore-300 mb-2">Core Palette</h2>
    <p class="text-sm text-fore-600 mb-8">
      The four color scales that make up the entire system. Base and foreground handle surfaces and text; accent and
      danger provide the only chromatic color.
    </p>

    @for (scale of coreScales; track scale.name) {
      <section class="mb-12">
        <div class="mb-4">
          <h3 class="text-lg font-bold text-fore-300">{{ scale.name }}</h3>
          <p class="text-sm text-fore-600">{{ scale.description }}</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-2">
          @for (swatch of scale.swatches; track swatch.shade) {
            <div class="flex flex-col">
              <div class="h-16 rounded-lg mb-1.5" [class]="swatch.class"></div>
              <span class="text-xs font-semibold text-fore-500">{{ swatch.shade }}</span>
              <span class="text-xs font-mono text-fore-700">{{ swatch.hex }}</span>
            </div>
          }
        </div>
      </section>
    }

    <!-- Semantic Aliases -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-fore-300 mb-2 mt-4">Semantic Aliases</h2>
      <p class="text-sm text-fore-600 mb-8">
        Shorthand tokens that map to specific scale values. Use these for the most common surfaces.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="rounded-xl border border-base-700 bg-base-800 p-5">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-lg bg-bg border border-base-700"></div>
            <h3 class="text-sm font-bold text-fore-300">bg</h3>
          </div>
          <p class="text-sm text-fore-600 leading-relaxed">Page background. Maps to base-950 (#111110).</p>
        </div>
        <div class="rounded-xl border border-base-700 bg-base-800 p-5">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-lg bg-fg"></div>
            <h3 class="text-sm font-bold text-fore-300">fg</h3>
          </div>
          <p class="text-sm text-fore-600 leading-relaxed">Primary foreground. Maps to fore-300 (#F5F0E4).</p>
        </div>
        <div class="rounded-xl border border-base-700 bg-base-800 p-5">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-lg border-2 border-border"></div>
            <h3 class="text-sm font-bold text-fore-300">border</h3>
          </div>
          <p class="text-sm text-fore-600 leading-relaxed">Default border. oklch(0.9 0.01 90 / 0.12).</p>
        </div>
      </div>
    </section>

    <!-- Usage guidance -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-fore-300 mb-4">Usage Guidelines</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (guideline of usageGuidelines; track guideline.title) {
          <div class="rounded-xl border border-base-700 bg-base-800 p-5">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-8 h-8 rounded-lg" [class]="guideline.swatchClass"></div>
              <h3 class="text-sm font-bold text-fore-300">{{ guideline.title }}</h3>
            </div>
            <p class="text-sm text-fore-600 leading-relaxed">{{ guideline.description }}</p>
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
  readonly coreScales: ColorScale[] = [
    {
      name: 'Base — Almost Black',
      description: 'Dark neutral scale for backgrounds, surfaces, and borders.',
      swatches: [
        { shade: '50', hex: '#e8e8e7', class: 'bg-base-50', textClass: 'text-base-950' },
        { shade: '100', hex: '#d1d1cf', class: 'bg-base-100', textClass: 'text-base-950' },
        { shade: '200', hex: '#a3a3a0', class: 'bg-base-200', textClass: 'text-base-950' },
        { shade: '300', hex: '#757571', class: 'bg-base-300', textClass: 'text-base-950' },
        { shade: '400', hex: '#4a4a47', class: 'bg-base-400', textClass: 'text-fore-300' },
        { shade: '500', hex: '#333330', class: 'bg-base-500', textClass: 'text-fore-300' },
        { shade: '600', hex: '#2a2a27', class: 'bg-base-600', textClass: 'text-fore-300' },
        { shade: '700', hex: '#21211f', class: 'bg-base-700', textClass: 'text-fore-300' },
        { shade: '800', hex: '#1a1a18', class: 'bg-base-800', textClass: 'text-fore-300' },
        { shade: '900', hex: '#141413', class: 'bg-base-900', textClass: 'text-fore-300' },
        { shade: '950', hex: '#111110', class: 'bg-base-950', textClass: 'text-fore-300' },
      ],
    },
    {
      name: 'Fore — Linen White',
      description: 'Warm foreground scale for text, icons, and light accents.',
      swatches: [
        { shade: '50', hex: '#fdfcfa', class: 'bg-fore-50', textClass: 'text-base-950' },
        { shade: '100', hex: '#faf8f3', class: 'bg-fore-100', textClass: 'text-base-950' },
        { shade: '200', hex: '#f7f4ec', class: 'bg-fore-200', textClass: 'text-base-950' },
        { shade: '300', hex: '#f5f0e4', class: 'bg-fore-300', textClass: 'text-base-950' },
        { shade: '400', hex: '#e8dfd0', class: 'bg-fore-400', textClass: 'text-base-950' },
        { shade: '500', hex: '#d4c9b6', class: 'bg-fore-500', textClass: 'text-base-950' },
        { shade: '600', hex: '#b0a48f', class: 'bg-fore-600', textClass: 'text-base-950' },
        { shade: '700', hex: '#8c7f6a', class: 'bg-fore-700', textClass: 'text-base-950' },
        { shade: '800', hex: '#6b6050', class: 'bg-fore-800', textClass: 'text-fore-300' },
        { shade: '900', hex: '#4a4237', class: 'bg-fore-900', textClass: 'text-fore-300' },
        { shade: '950', hex: '#2a2520', class: 'bg-fore-950', textClass: 'text-fore-300' },
      ],
    },
    {
      name: 'Accent — Brand Orange',
      description: 'The only chromatic brand color. Reserved for primary actions, links, and key UI moments.',
      swatches: [
        { shade: '50', hex: '#fff8eb', class: 'bg-accent-50', textClass: 'text-base-950' },
        { shade: '100', hex: '#ffefc6', class: 'bg-accent-100', textClass: 'text-base-950' },
        { shade: '200', hex: '#ffdb88', class: 'bg-accent-200', textClass: 'text-base-950' },
        { shade: '300', hex: '#ffc44a', class: 'bg-accent-300', textClass: 'text-base-950' },
        { shade: '400', hex: '#ffad1f', class: 'bg-accent-400', textClass: 'text-base-950' },
        { shade: '500', hex: '#ff9500', class: 'bg-accent-500', textClass: 'text-base-950' },
        { shade: '600', hex: '#e07400', class: 'bg-accent-600', textClass: 'text-base-950' },
        { shade: '700', hex: '#b85500', class: 'bg-accent-700', textClass: 'text-base-950' },
        { shade: '800', hex: '#944010', class: 'bg-accent-800', textClass: 'text-base-950' },
        { shade: '900', hex: '#7a3510', class: 'bg-accent-900', textClass: 'text-base-950' },
        { shade: '950', hex: '#461a04', class: 'bg-accent-950', textClass: 'text-base-950' },
      ],
    },
    {
      name: 'Danger — Warm Red',
      description: 'Warm orange-tinted red for errors, destructive actions, and critical states.',
      swatches: [
        { shade: '50', hex: '#fff4f2', class: 'bg-danger-50', textClass: 'text-base-950' },
        { shade: '100', hex: '#ffe5e0', class: 'bg-danger-100', textClass: 'text-base-950' },
        { shade: '200', hex: '#ffc5bc', class: 'bg-danger-200', textClass: 'text-base-950' },
        { shade: '300', hex: '#ff9585', class: 'bg-danger-300', textClass: 'text-base-950' },
        { shade: '400', hex: '#ff5e4b', class: 'bg-danger-400', textClass: 'text-base-950' },
        { shade: '500', hex: '#e63a24', class: 'bg-danger-500', textClass: 'text-base-950' },
        { shade: '600', hex: '#c22b18', class: 'bg-danger-600', textClass: 'text-base-950' },
        { shade: '700', hex: '#9e2012', class: 'bg-danger-700', textClass: 'text-base-950' },
        { shade: '800', hex: '#831c10', class: 'bg-danger-800', textClass: 'text-base-950' },
        { shade: '900', hex: '#6e1a10', class: 'bg-danger-900', textClass: 'text-base-950' },
        { shade: '950', hex: '#3c0906', class: 'bg-danger-950', textClass: 'text-base-950' },
      ],
    },
  ];

  readonly usageGuidelines = [
    {
      title: 'Accent Actions',
      swatchClass: 'bg-accent-500',
      description:
        'Use accent-500 for primary buttons and links. accent-600 for hover states. Reserve accent color for interactive moments only.',
    },
    {
      title: 'Dark Surfaces',
      swatchClass: 'bg-base-800',
      description:
        'Use base-800 for cards and elevated surfaces, base-900 for page backgrounds, base-700 for borders and dividers.',
    },
    {
      title: 'Foreground Text',
      swatchClass: 'bg-fore-300',
      description:
        'fore-300 for headings and high-emphasis text, fore-600 for body copy, fore-700 for muted text and captions.',
    },
    {
      title: 'Danger States',
      swatchClass: 'bg-danger-500',
      description:
        'danger-500 for error borders and destructive button backgrounds. danger-400 for error text on dark surfaces.',
    },
    {
      title: 'Pattern, Not Color',
      swatchClass: 'bg-base-700',
      description:
        'Workout types are differentiated by geometric pattern (waves, circles, grids), not by color scales. This keeps the palette unified.',
    },
  ];
}
