import { Component } from '@angular/core';

@Component({
  selector: 'app-style-guide-spacing',
  standalone: true,
  template: `
    <h1 class="text-3xl font-extrabold text-surface-900 tracking-tight mb-2">Spacing</h1>
    <p class="text-surface-500 mb-10 max-w-2xl">
      Spacing is based on a 4px (0.25rem) base unit. All padding, margin, and gap values are multiples of this unit,
      producing a consistent and predictable rhythm across the UI.
    </p>

    <!-- Spacing Scale -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-2">Spacing Scale</h2>
      <p class="text-sm text-surface-500 mb-6">
        Common steps from the Tailwind spacing scale. Use these values for padding, margin, and gap.
      </p>
      <div class="rounded-xl border border-surface-200 bg-white overflow-hidden divide-y divide-surface-100">
        <div class="flex items-center gap-6 px-6 py-2 bg-surface-50">
          <span class="w-16 shrink-0 text-xs font-semibold text-surface-500 uppercase tracking-wider">Token</span>
          <span class="w-16 shrink-0 text-xs font-semibold text-surface-500 uppercase tracking-wider">rem</span>
          <span class="w-12 shrink-0 text-xs font-semibold text-surface-500 uppercase tracking-wider">px</span>
          <span class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Visual</span>
        </div>
        @for (step of spacingScale; track step.token) {
          <div class="flex items-center gap-6 px-6 py-3">
            <span class="w-16 shrink-0 text-xs font-mono text-primary-600">{{ step.token }}</span>
            <span class="w-16 shrink-0 text-xs font-mono text-surface-500">{{ step.rem }}</span>
            <span class="w-12 shrink-0 text-xs font-mono text-surface-400">{{ step.px }}</span>
            <div class="bg-primary-400 rounded-sm" [style.width]="step.width" style="height: 14px;"></div>
          </div>
        }
      </div>
    </section>

    <!-- Border Radius Scale -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-2">Border Radius</h2>
      <p class="text-sm text-surface-500 mb-6">
        Custom radius scale defined in the theme. Use these tokens for consistent corner rounding.
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
        @for (r of radiusScale; track r.token) {
          <div class="flex flex-col items-start gap-3">
            <div [class]="'bg-primary-100 border-2 border-primary-300 ' + r.class + ' ' + r.sizeClass"></div>
            <div>
              <p class="text-xs font-semibold text-surface-700">{{ r.token }}</p>
              <p class="text-xs font-mono text-surface-400">{{ r.px }}</p>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- Common Spacing Patterns -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-2">Common Patterns</h2>
      <p class="text-sm text-surface-500 mb-6">Spacing conventions used consistently throughout the app.</p>
      <div class="rounded-xl border border-surface-200 bg-white overflow-hidden divide-y divide-surface-100">
        @for (pattern of commonPatterns; track pattern.label) {
          <div class="px-6 py-4">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm font-bold text-surface-900 mb-0.5">{{ pattern.label }}</p>
                <p class="text-xs text-surface-500 mb-2">{{ pattern.description }}</p>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 mt-1">
              @for (token of pattern.tokens; track token.class) {
                <span
                  class="inline-flex items-center gap-1.5 text-xs font-mono bg-surface-100 text-surface-700 px-2 py-1 rounded-md"
                >
                  <span class="w-2 h-2 rounded-sm bg-primary-400 shrink-0"></span>
                  {{ token.class }}
                  <span class="text-surface-400">({{ token.px }})</span>
                </span>
              }
            </div>
          </div>
        }
      </div>
    </section>

    <!-- Guidelines -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-surface-900 mb-2">Guidelines</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="rounded-xl border border-success-200 bg-success-50 p-5">
          <p class="text-xs font-semibold text-success-700 uppercase tracking-wider mb-3">Do</p>
          <ul class="space-y-2">
            @for (item of dos; track item) {
              <li class="flex items-start gap-2 text-sm text-surface-700">
                <span class="text-success-600 font-bold shrink-0 mt-0.5">&#10003;</span>
                {{ item }}
              </li>
            }
          </ul>
        </div>
        <div class="rounded-xl border border-danger-200 bg-danger-50 p-5">
          <p class="text-xs font-semibold text-danger-700 uppercase tracking-wider mb-3">Don&apos;t</p>
          <ul class="space-y-2">
            @for (item of donts; track item) {
              <li class="flex items-start gap-2 text-sm text-surface-700">
                <span class="text-danger-600 font-bold shrink-0 mt-0.5">&#10007;</span>
                {{ item }}
              </li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
  host: {
    class: 'block',
  },
})
export class StyleGuideSpacingComponent {
  readonly spacingScale = [
    { token: '0.5', rem: '0.125rem', px: '2px', width: '2px' },
    { token: '1', rem: '0.25rem', px: '4px', width: '4px' },
    { token: '2', rem: '0.5rem', px: '8px', width: '8px' },
    { token: '3', rem: '0.75rem', px: '12px', width: '12px' },
    { token: '4', rem: '1rem', px: '16px', width: '16px' },
    { token: '5', rem: '1.25rem', px: '20px', width: '20px' },
    { token: '6', rem: '1.5rem', px: '24px', width: '24px' },
    { token: '8', rem: '2rem', px: '32px', width: '32px' },
    { token: '10', rem: '2.5rem', px: '40px', width: '40px' },
    { token: '12', rem: '3rem', px: '48px', width: '48px' },
    { token: '16', rem: '4rem', px: '64px', width: '64px' },
    { token: '20', rem: '5rem', px: '80px', width: '80px' },
    { token: '24', rem: '6rem', px: '96px', width: '96px' },
    { token: '32', rem: '8rem', px: '128px', width: '128px' },
  ];

  readonly radiusScale = [
    { token: 'rounded-xs', class: 'rounded-xs', px: '4px', sizeClass: 'w-16 h-16' },
    { token: 'rounded-sm', class: 'rounded-sm', px: '6px', sizeClass: 'w-16 h-16' },
    { token: 'rounded-md', class: 'rounded-md', px: '9px', sizeClass: 'w-16 h-16' },
    { token: 'rounded-lg', class: 'rounded-lg', px: '13.5px', sizeClass: 'w-20 h-20' },
    { token: 'rounded-xl', class: 'rounded-xl', px: '20px', sizeClass: 'w-20 h-20' },
    { token: 'rounded-2xl', class: 'rounded-2xl', px: '30px', sizeClass: 'w-24 h-24' },
    { token: 'rounded-3xl', class: 'rounded-3xl', px: '46px', sizeClass: 'w-32 h-32' },
    { token: 'rounded-4xl', class: 'rounded-4xl', px: '68px', sizeClass: 'w-44 h-44' },
    { token: 'rounded-full', class: 'rounded-full', px: '9999px', sizeClass: 'w-16 h-16' },
  ];

  readonly commonPatterns = [
    {
      label: 'Card Padding',
      description: 'Inner content padding for cards and panels.',
      tokens: [
        { class: 'p-4', px: '16px — compact' },
        { class: 'p-5', px: '20px — default' },
        { class: 'p-6', px: '24px — relaxed' },
        { class: 'p-8', px: '32px — spacious' },
      ],
    },
    {
      label: 'Inline Gap',
      description: 'Horizontal gap between sibling elements in a flex row.',
      tokens: [
        { class: 'gap-2', px: '8px — tight' },
        { class: 'gap-3', px: '12px — default' },
        { class: 'gap-4', px: '16px — relaxed' },
        { class: 'gap-6', px: '24px — loose' },
      ],
    },
    {
      label: 'Section Spacing',
      description: 'Bottom margin separating major content sections.',
      tokens: [
        { class: 'mb-6', px: '24px — tight' },
        { class: 'mb-8', px: '32px — default' },
        { class: 'mb-12', px: '48px — loose' },
      ],
    },
    {
      label: 'Form Field Stack',
      description: 'Vertical gap between stacked form elements.',
      tokens: [
        { class: 'space-y-1.5', px: '6px — label/input' },
        { class: 'space-y-4', px: '16px — between fields' },
        { class: 'space-y-6', px: '24px — between groups' },
      ],
    },
    {
      label: 'Page Content',
      description: 'Horizontal and vertical padding for main content areas.',
      tokens: [
        { class: 'px-6', px: '24px — mobile' },
        { class: 'px-10', px: '40px — desktop' },
        { class: 'py-10', px: '40px — mobile' },
        { class: 'py-12', px: '48px — desktop' },
      ],
    },
  ];

  readonly dos = [
    'Use spacing tokens from the scale — avoid arbitrary pixel values.',
    'Use gap utilities for flex and grid layouts instead of margin on children.',
    'Keep section spacing consistent: mb-12 between top-level style guide sections.',
    'Use p-5 or p-6 as the default card padding.',
  ];

  readonly donts = [
    "Don't use arbitrary values like p-[18px] when a scale token fits.",
    "Don't mix margin-based and gap-based spacing within the same layout.",
    "Don't use spacing smaller than 2 (8px) as a section separator.",
    "Don't apply mb-* to the last child in a container — use gap on the parent.",
  ];
}
