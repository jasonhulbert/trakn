import { Component } from '@angular/core';

interface IconItem {
  name: string;
  class: string;
}

interface IconGroup {
  label: string;
  icons: IconItem[];
}

@Component({
  selector: 'app-style-guide-iconography',
  standalone: true,
  template: `
    <h1 class="text-3xl font-extrabold text-fore-300 tracking-tight mb-2">Iconography</h1>
    <p class="text-fore-600 mb-10 max-w-2xl">
      Icons are provided by
      <a href="https://iconoir.com" target="_blank" class="text-accent-500 hover:underline font-medium">Iconoir</a>, a
      clean open-source icon library with a consistent stroke-based aesthetic.
    </p>

    <!-- Usage -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-fore-300 mb-2">Usage</h2>
      <p class="text-sm text-fore-600 mb-6">
        Iconoir is loaded via CSS. Apply the
        <code class="text-xs font-mono bg-base-700 text-fore-300 px-1.5 py-0.5 rounded"
          >iconoir-{{ '{' }}name{{ '}' }}</code
        >
        class to any inline element.
      </p>
      <div class="rounded-xl border border-base-700 bg-base-800 p-6 space-y-4">
        <!-- HTML example -->
        <div>
          <p class="text-xs font-semibold text-fore-700 uppercase tracking-wider mb-3">HTML</p>
          <div class="bg-base-950 text-fore-200 rounded-lg px-5 py-4 font-mono text-sm leading-relaxed">
            <span class="text-fore-700">&lt;!-- Basic usage --&gt;</span><br />
            &lt;<span class="text-accent-400">i</span> <span class="text-accent-300">class</span>=<span
              class="text-accent-400"
              >"iconoir-running"</span
            >&gt;&lt;/<span class="text-accent-400">i</span>&gt;<br /><br />
            <span class="text-fore-700">&lt;!-- With size and color --&gt;</span><br />
            &lt;<span class="text-accent-400">i</span> <span class="text-accent-300">class</span>=<span
              class="text-accent-400"
              >"iconoir-heart text-2xl text-rose-500"</span
            >&gt;&lt;/<span class="text-accent-400">i</span>&gt;<br /><br />
            <span class="text-fore-700">&lt;!-- Icon + label --&gt;</span><br />
            &lt;<span class="text-accent-400">span</span> <span class="text-accent-300">class</span>=<span
              class="text-accent-400"
              >"flex items-center gap-2"</span
            >&gt;<br />
            &nbsp;&nbsp;&lt;<span class="text-accent-400">i</span> <span class="text-accent-300">class</span>=<span
              class="text-accent-400"
              >"iconoir-timer"</span
            >&gt;&lt;/<span class="text-accent-400">i</span>&gt;<br />
            &nbsp;&nbsp;&lt;<span class="text-accent-400">span</span>&gt;30 min&lt;/<span class="text-accent-400">span</span
            >&gt;<br />
            &lt;/<span class="text-accent-400">span</span>&gt;
          </div>
        </div>

        <!-- Live preview -->
        <div>
          <p class="text-xs font-semibold text-fore-700 uppercase tracking-wider mb-3">Live Preview</p>
          <div class="flex flex-wrap items-center gap-6">
            <span class="flex items-center gap-2 text-sm text-fore-300">
              <span class="iconoir-running text-xl"></span>
              Running
            </span>
            <span class="flex items-center gap-2 text-sm text-accent-500">
              <span class="iconoir-heart text-xl"></span>
              Heart rate
            </span>
            <span class="flex items-center gap-2 text-sm text-fore-300">
              <span class="iconoir-timer text-xl"></span>
              30 min
            </span>
            <span class="flex items-center gap-2 text-sm text-accent-500 font-semibold">
              <span class="iconoir-plus-circle text-xl"></span>
              New workout
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Sizes -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-fore-300 mb-2">Sizes</h2>
      <p class="text-sm text-fore-600 mb-6">
        Icon size is controlled by
        <code class="text-xs font-mono bg-base-700 text-fore-300 px-1.5 py-0.5 rounded">font-size</code>. Use
        Tailwind text utilities to scale consistently with surrounding text.
      </p>
      <div class="rounded-xl border border-base-700 bg-base-800 overflow-hidden divide-y divide-base-700">
        @for (size of sizes; track size.class) {
          <div class="flex items-center gap-6 px-6 py-4">
            <span class="w-24 shrink-0 text-xs font-mono text-accent-500">{{ size.class }}</span>
            <span class="w-16 shrink-0 text-xs text-fore-600">{{ size.px }}</span>
            <span class="w-32 shrink-0 text-xs text-fore-700">{{ size.usage }}</span>
            <span [class]="'iconoir-activity text-fore-300 ' + size.class"></span>
          </div>
        }
      </div>
    </section>

    <!-- Icon Groups -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-fore-300 mb-2">Icon Library</h2>
      <p class="text-sm text-fore-600 mb-6">
        A curated selection of icons relevant to Trakn. For the full catalog visit
        <a href="https://iconoir.com" target="_blank" class="text-accent-500 hover:underline">iconoir.com</a>.
      </p>

      <div class="space-y-8">
        @for (group of iconGroups; track group.label) {
          <div>
            <p class="text-xs font-semibold text-fore-700 uppercase tracking-wider mb-4">{{ group.label }}</p>
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              @for (icon of group.icons; track icon.name) {
                <div
                  class="flex flex-col items-center gap-2 rounded-xl border border-base-700 bg-base-800 p-4 hover:border-accent-500/30 hover:bg-base-700 transition-colors"
                >
                  <span [class]="icon.class + ' text-2xl text-fore-300'"></span>
                  <span class="text-xs text-fore-600 text-center leading-tight">{{ icon.name }}</span>
                </div>
              }
            </div>
          </div>
        }
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
export class StyleGuideIconographyComponent {
  readonly sizes = [
    { class: 'text-sm', px: '14px', usage: 'Inline / dense UI' },
    { class: 'text-base', px: '16px', usage: 'Default body text' },
    { class: 'text-lg', px: '18px', usage: 'Buttons, labels' },
    { class: 'text-xl', px: '20px', usage: 'Standard UI icons' },
    { class: 'text-2xl', px: '24px', usage: 'Feature icons' },
    { class: 'text-3xl', px: '30px', usage: 'Large / hero icons' },
    { class: 'text-4xl', px: '36px', usage: 'Display / empty states' },
  ];

  readonly iconGroups: IconGroup[] = [
    {
      label: 'Navigation',
      icons: [
        { name: 'home', class: 'iconoir-home' },
        { name: 'menu', class: 'iconoir-menu' },
        { name: 'arrow-left', class: 'iconoir-arrow-left' },
        { name: 'arrow-right', class: 'iconoir-arrow-right' },
        { name: 'search', class: 'iconoir-search' },
        { name: 'settings', class: 'iconoir-settings' },
      ],
    },
    {
      label: 'Actions',
      icons: [
        { name: 'plus', class: 'iconoir-plus' },
        { name: 'plus-circle', class: 'iconoir-plus-circle' },
        { name: 'minus-circle', class: 'iconoir-minus-circle' },
        { name: 'edit-pencil', class: 'iconoir-edit-pencil' },
        { name: 'trash', class: 'iconoir-trash' },
        { name: 'eye', class: 'iconoir-eye' },
        { name: 'check', class: 'iconoir-check' },
        { name: 'xmark', class: 'iconoir-xmark' },
        { name: 'lock', class: 'iconoir-lock' },
        { name: 'star', class: 'iconoir-star' },
        { name: 'bell', class: 'iconoir-bell' },
        { name: 'calendar', class: 'iconoir-calendar' },
      ],
    },
    {
      label: 'Fitness & Workout',
      icons: [
        { name: 'running', class: 'iconoir-running' },
        { name: 'activity', class: 'iconoir-activity' },
        { name: 'gym', class: 'iconoir-gym' },
        { name: 'weight', class: 'iconoir-weight' },
        { name: 'heart', class: 'iconoir-heart' },
        { name: 'timer', class: 'iconoir-timer' },
        { name: 'clock', class: 'iconoir-clock' },
        { name: 'trophy', class: 'iconoir-trophy' },
        { name: 'medal', class: 'iconoir-medal' },
      ],
    },
    {
      label: 'Status & Feedback',
      icons: [
        { name: 'info-circle', class: 'iconoir-info-circle' },
        { name: 'warning-triangle', class: 'iconoir-warning-triangle' },
        { name: 'check', class: 'iconoir-check' },
        { name: 'xmark', class: 'iconoir-xmark' },
      ],
    },
    {
      label: 'User & Account',
      icons: [
        { name: 'user', class: 'iconoir-user' },
        { name: 'lock', class: 'iconoir-lock' },
      ],
    },
  ];

  readonly dos = [
    'Match icon size to surrounding text size using Tailwind text utilities.',
    'Always pair icons with a visible label or accessible aria-label.',
    'Use icons from the Iconoir library to maintain visual consistency.',
    'Use currentColor (default) so icons inherit text color naturally.',
  ];

  readonly donts = [
    "Don't size icons with width/height — use font-size (text-*) instead.",
    "Don't use icons as the sole indicator of meaning without a label.",
    "Don't mix icon libraries — stick to Iconoir throughout.",
    "Don't apply stroke or fill directly — the CSS mask approach handles rendering.",
  ];
}
