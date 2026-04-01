import { Component } from '@angular/core';

@Component({
  selector: 'app-style-guide-animation',
  standalone: true,
  template: `
    <h1 class="text-3xl font-extrabold text-fore-300 tracking-tight mb-2">Animation</h1>
    <p class="text-fore-600 mb-10 max-w-2xl">
      Animation in Trakn is purposeful and restrained. Motion communicates state changes and guides attention — it
      doesn't decorate. Prefer short durations and natural easing over elaborate effects.
    </p>

    <!-- Principles -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-fore-300 mb-4">Principles</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        @for (p of principles; track p.title) {
          <div class="rounded-xl border border-base-700 bg-base-800 p-5">
            <p class="text-sm font-bold text-fore-300 mb-1">{{ p.title }}</p>
            <p class="text-sm text-fore-600 leading-relaxed">{{ p.description }}</p>
          </div>
        }
      </div>
    </section>

    <!-- Timing Reference -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-fore-300 mb-2">Timing Reference</h2>
      <p class="text-sm text-fore-600 mb-6">
        Use the shortest duration that still feels intentional. Reserve longer values for larger layout changes.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Duration -->
        <div>
          <p class="text-xs font-semibold text-fore-700 uppercase tracking-wider mb-3">Duration</p>
          <div class="rounded-xl border border-base-700 bg-base-800 overflow-hidden divide-y divide-base-700">
            <div class="flex items-center gap-4 px-4 py-2 bg-base-900">
              <span class="w-28 shrink-0 text-xs font-semibold text-fore-600 uppercase tracking-wider">Token</span>
              <span class="w-14 shrink-0 text-xs font-semibold text-fore-600 uppercase tracking-wider">Value</span>
              <span class="text-xs font-semibold text-fore-600 uppercase tracking-wider">Use for</span>
            </div>
            @for (row of durations; track row.token) {
              <div class="flex items-center gap-4 px-4 py-3">
                <span class="w-28 shrink-0 text-xs font-mono text-accent-500">{{ row.token }}</span>
                <span class="w-14 shrink-0 text-xs font-mono text-fore-700">{{ row.value }}</span>
                <span class="text-xs text-fore-600">{{ row.use }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Easing -->
        <div>
          <p class="text-xs font-semibold text-fore-700 uppercase tracking-wider mb-3">Easing</p>
          <div class="rounded-xl border border-base-700 bg-base-800 overflow-hidden divide-y divide-base-700">
            <div class="flex items-center gap-4 px-4 py-2 bg-base-900">
              <span class="w-28 shrink-0 text-xs font-semibold text-fore-600 uppercase tracking-wider">Token</span>
              <span class="text-xs font-semibold text-fore-600 uppercase tracking-wider">Use for</span>
            </div>
            @for (row of easings; track row.token) {
              <div class="flex items-center gap-4 px-4 py-3">
                <span class="w-28 shrink-0 text-xs font-mono text-accent-500">{{ row.token }}</span>
                <span class="text-xs text-fore-600">{{ row.use }}</span>
              </div>
            }
          </div>
        </div>
      </div>
    </section>

    <!-- Tailwind Transitions -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-fore-300 mb-2">Tailwind Transitions</h2>
      <p class="text-sm text-fore-600 mb-6">
        Use
        <code class="text-xs font-mono bg-base-700 text-fore-300 px-1.5 py-0.5 rounded">transition-*</code>
        utilities for hover and focus state changes. Always pair with
        <code class="text-xs font-mono bg-base-700 text-fore-300 px-1.5 py-0.5 rounded">duration-*</code>
        and
        <code class="text-xs font-mono bg-base-700 text-fore-300 px-1.5 py-0.5 rounded">ease-*</code>.
      </p>
      <div class="space-y-4">
        <!-- transition-colors -->
        <div class="rounded-xl border border-base-700 bg-base-800 p-5">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div>
              <p class="text-sm font-bold text-fore-300 mb-0.5">Color</p>
              <p class="text-xs text-fore-600">
                Hover state changes on interactive elements — buttons, links, nav items.
              </p>
            </div>
            <code class="shrink-0 text-xs font-mono bg-base-700 text-fore-300 px-2 py-1 rounded-md"
              >transition-colors duration-150 ease-out</code
            >
          </div>
          <div class="flex flex-wrap gap-3 items-center">
            <button
              class="px-4 py-2 bg-accent-500 text-base-950 text-sm font-medium rounded-lg transition-colors duration-150 ease-out hover:bg-accent-600 active:bg-accent-700"
            >
              Save workout
            </button>
            <button
              class="px-4 py-2 bg-base-800 border border-base-700 text-fore-300 text-sm font-medium rounded-lg transition-colors duration-150 ease-out hover:bg-base-700"
            >
              Cancel
            </button>
            <a
              class="px-3 py-2 text-sm font-medium text-fore-500 rounded-lg cursor-pointer transition-colors duration-150 ease-out hover:bg-base-700 hover:text-fore-300"
            >
              Nav link
            </a>
          </div>
        </div>

        <!-- transition-opacity -->
        <div class="rounded-xl border border-base-700 bg-base-800 p-5">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div>
              <p class="text-sm font-bold text-fore-300 mb-0.5">Opacity</p>
              <p class="text-xs text-fore-600">
                Hover dimming for secondary actions, icon buttons, and ghost controls.
              </p>
            </div>
            <code class="shrink-0 text-xs font-mono bg-base-700 text-fore-300 px-2 py-1 rounded-md"
              >transition-opacity duration-150 ease-out</code
            >
          </div>
          <div class="flex flex-wrap gap-4 items-center">
            <button
              class="flex items-center gap-1.5 text-sm text-fore-600 transition-opacity duration-150 ease-out hover:opacity-50"
            >
              <span class="iconoir-trash text-base"></span>
              Delete
            </button>
            <button
              class="flex items-center gap-1.5 text-sm text-fore-600 transition-opacity duration-150 ease-out hover:opacity-50"
            >
              <span class="iconoir-edit-pencil text-base"></span>
              Edit
            </button>
          </div>
        </div>

        <!-- transition-transform -->
        <div class="rounded-xl border border-base-700 bg-base-800 p-5">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div>
              <p class="text-sm font-bold text-fore-300 mb-0.5">Transform</p>
              <p class="text-xs text-fore-600">Subtle lift for cards or scale-up for icon buttons.</p>
            </div>
            <code class="shrink-0 text-xs font-mono bg-base-700 text-fore-300 px-2 py-1 rounded-md"
              >transition-transform duration-150 ease-out</code
            >
          </div>
          <div class="flex flex-wrap gap-3 items-center">
            <div
              class="px-5 py-3 bg-base-800 border border-base-700 rounded-xl text-sm text-fore-300 cursor-pointer transition-transform duration-150 ease-out hover:-translate-y-0.5"
            >
              Card lift
            </div>
            <button
              class="w-9 h-9 flex items-center justify-center rounded-full bg-accent-500/20 text-accent-500 transition-transform duration-150 ease-out hover:scale-110 active:scale-95"
            >
              <span class="iconoir-plus text-base"></span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Tailwind Keyframe Animations -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-fore-300 mb-2">Tailwind Keyframe Animations</h2>
      <p class="text-sm text-fore-600 mb-6">
        Built-in
        <code class="text-xs font-mono bg-base-700 text-fore-300 px-1.5 py-0.5 rounded">animate-*</code>
        utilities for loading states and attention cues. Use sparingly.
      </p>
      <div class="rounded-xl border border-base-700 bg-base-800 overflow-hidden divide-y divide-base-700">
        @for (anim of keyframeAnims; track anim.token) {
          <div class="flex items-center gap-6 px-6 py-4">
            <span class="w-36 shrink-0 text-xs font-mono text-accent-500">{{ anim.token }}</span>
            <span class="w-40 shrink-0 text-xs text-fore-600">{{ anim.use }}</span>
            <div [class]="anim.demoClass"></div>
          </div>
        }
      </div>
    </section>

    <!-- Angular Animations -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-fore-300 mb-2">Angular Animations</h2>
      <p class="text-sm text-fore-600 mb-6">
        Use
        <code class="text-xs font-mono bg-base-700 text-fore-300 px-1.5 py-0.5 rounded"
          >&#64;angular/animations</code
        >
        for enter/leave transitions and state-driven motion. Requires
        <code class="text-xs font-mono bg-base-700 text-fore-300 px-1.5 py-0.5 rounded">provideAnimations()</code>
        in the app config.
      </p>

      <div class="space-y-6">
        @for (example of angularExamples; track example.label) {
          <div class="rounded-xl border border-base-700 bg-base-800 overflow-hidden">
            <div class="px-5 py-4 border-b border-base-700">
              <p class="text-sm font-bold text-fore-300 mb-0.5">{{ example.label }}</p>
              <p class="text-xs text-fore-600">{{ example.description }}</p>
            </div>
            <div class="bg-base-950 px-5 py-4 overflow-x-auto">
              <pre class="font-mono text-sm leading-relaxed text-fore-200 whitespace-pre">{{ example.code }}</pre>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- Reduced Motion -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-fore-300 mb-2">Reduced Motion</h2>
      <p class="text-sm text-fore-600 mb-4">
        Always respect the
        <code class="text-xs font-mono bg-base-700 text-fore-300 px-1.5 py-0.5 rounded"
          >prefers-reduced-motion</code
        >
        media query. Use Tailwind's
        <code class="text-xs font-mono bg-base-700 text-fore-300 px-1.5 py-0.5 rounded">motion-reduce:</code>
        variant or Angular's animation
        <code class="text-xs font-mono bg-base-700 text-fore-300 px-1.5 py-0.5 rounded">disabled</code>
        state.
      </p>
      <div class="rounded-xl border border-base-700 bg-base-800 overflow-hidden">
        <div class="bg-base-950 px-5 py-4 overflow-x-auto">
          <pre class="font-mono text-sm leading-relaxed text-fore-200 whitespace-pre">{{ reducedMotionCode }}</pre>
        </div>
      </div>
    </section>

    <!-- Guidelines -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-fore-300 mb-2">Guidelines</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="rounded-xl border border-accent-500/20 bg-accent-500/10 p-5">
          <p class="text-xs font-semibold text-accent-500 uppercase tracking-wider mb-3">Do</p>
          <ul class="space-y-2">
            @for (item of dos; track item) {
              <li class="flex items-start gap-2 text-sm text-fore-300">
                <span class="text-accent-500 font-bold shrink-0 mt-0.5">&#10003;</span>
                {{ item }}
              </li>
            }
          </ul>
        </div>
        <div class="rounded-xl border border-danger-500/20 bg-danger-500/10 p-5">
          <p class="text-xs font-semibold text-danger-400 uppercase tracking-wider mb-3">Don&apos;t</p>
          <ul class="space-y-2">
            @for (item of donts; track item) {
              <li class="flex items-start gap-2 text-sm text-fore-300">
                <span class="text-danger-400 font-bold shrink-0 mt-0.5">&#10007;</span>
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
export class StyleGuideAnimationComponent {
  readonly principles = [
    {
      title: 'Purposeful',
      description:
        'Every animation should communicate something — a state change, a new element appearing, a response to input. If it adds nothing, remove it.',
    },
    {
      title: 'Fast',
      description:
        'UI transitions should be quick. Most interactions belong in the 100–200ms range. Animation is a signal, not a performance.',
    },
    {
      title: 'Consistent',
      description:
        'Use the same easing and duration values across similar interactions. Predictable motion feels polished without drawing attention to itself.',
    },
    {
      title: 'Respectful',
      description:
        'Always support prefers-reduced-motion. Users who opt out of motion should get a fully functional, non-animated experience.',
    },
  ];

  readonly durations = [
    { token: 'duration-75', value: '75ms', use: 'Focus rings, micro state changes' },
    { token: 'duration-150', value: '150ms', use: 'Default hover and toggle interactions' },
    { token: 'duration-200', value: '200ms', use: 'Dropdowns, tooltips, small reveals' },
    { token: 'duration-300', value: '300ms', use: 'Modals, drawers, panel transitions' },
    { token: 'duration-500', value: '500ms', use: 'Page-level or skeleton-to-content' },
  ];

  readonly easings = [
    { token: 'ease-out', use: 'Elements entering the screen — fast start, smooth settle' },
    { token: 'ease-in', use: 'Elements leaving the screen — builds then exits quickly' },
    { token: 'ease-in-out', use: 'State toggles that stay on screen (expand, collapse)' },
    { token: 'linear', use: 'Progress bars, spinners, continuous loops' },
  ];

  readonly keyframeAnims = [
    {
      token: 'animate-spin',
      use: 'Loading spinners',
      demoClass: 'w-5 h-5 rounded-full border-2 border-base-700 border-t-accent-500 animate-spin',
    },
    {
      token: 'animate-pulse',
      use: 'Skeleton loading placeholders',
      demoClass: 'w-32 h-4 rounded bg-base-700 animate-pulse',
    },
    {
      token: 'animate-bounce',
      use: 'Attention cues — use very sparingly',
      demoClass: 'w-4 h-4 rounded-full bg-accent-400 animate-bounce',
    },
  ];

  readonly angularExamples = [
    {
      label: 'Fade',
      description: 'Fade in on enter, fade out on leave. Use for toasts, tooltips, and conditional panels.',
      code: `// component.ts
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})

// template
@if (visible()) {
  <div @fade>Content</div>
}`,
    },
    {
      label: 'Slide Down',
      description: 'Slide in from slightly above on enter. Use for dropdowns and expandable sections.',
      code: `// component.ts
trigger('slideDown', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-8px)' }),
    animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
  transition(':leave', [
    animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-8px)' })),
  ]),
])

// template
@if (open()) {
  <div @slideDown>Dropdown content</div>
}`,
    },
    {
      label: 'Stagger List',
      description: 'Animate list items in sequence on enter. Use for initial data loads — not repeat renders.',
      code: `// component.ts
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

trigger('listStagger', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(8px)' }),
      stagger(40, [
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ], { optional: true }),
  ]),
])

// template — apply to the parent container
<ul [@listStagger]="items().length">
  @for (item of items(); track item.id) {
    <li>{{ item.name }}</li>
  }
</ul>`,
    },
  ];

  readonly reducedMotionCode = `// Tailwind — disable transitions for users who prefer reduced motion
<button class="transition-colors duration-150 ease-out motion-reduce:transition-none ...">
  Save
</button>

// Angular — check media query in component
readonly prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Pass to animation state to skip motion
<div [@fade]="prefersReducedMotion ? 'void' : undefined">...</div>`;

  readonly dos = [
    'Use duration-150 as the default for hover and toggle interactions.',
    'Use ease-out for elements entering the screen, ease-in for exits.',
    'Use Angular animations for enter/leave; use Tailwind transitions for hover/focus.',
    'Add motion-reduce:transition-none to every transition-* class.',
    'Keep stagger delays short — 30–50ms per item maximum.',
  ];

  readonly donts = [
    "Don't animate multiple properties simultaneously unless they're in a single trigger.",
    "Don't use duration-500 or longer for UI state changes — reserve it for page transitions.",
    "Don't use animate-bounce for anything load-bearing — it draws too much attention.",
    "Don't add animation just because something appears — static reveals are fine.",
    "Don't skip motion-reduce support.",
  ];
}
