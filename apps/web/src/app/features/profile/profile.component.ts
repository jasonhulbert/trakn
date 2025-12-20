import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <a routerLink="/" class="text-indigo-600 hover:text-indigo-500">← Back to Home</a>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
        <div class="bg-white shadow rounded-lg p-6">
          <p class="text-gray-500">Profile settings coming in Phase 2</p>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent {}
