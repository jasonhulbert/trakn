import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import type { User, Session } from '@supabase/supabase-js';
import { authRoutesTmpl } from '../../features/auth/auth.routes';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Signals for reactive state management
  currentUser = signal<User | null>(null);
  currentSession = signal<Session | null>(null);
  isAuthenticated = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);
  private readonly initPromise: Promise<void>;

  constructor() {
    this.initPromise = this.initializeAuth();
  }

  /**
   * Wait for authentication initialization to complete.
   * Guards should await this before checking auth state.
   */
  async waitForInitialization(): Promise<void> {
    await this.initPromise;
  }

  private async initializeAuth() {
    // Get initial session
    const {
      data: { session },
    } = await this.supabase.auth.getSession();
    this.updateAuthState(session);

    // Listen for auth state changes
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.updateAuthState(session);
    });

    this.isLoading.set(false);
  }

  private updateAuthState(session: Session | null) {
    this.currentSession.set(session);
    this.currentUser.set(session?.user ?? null);
    this.isAuthenticated.set(!!session);
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.session) {
      await this.router.navigate(['/']);
    }

    return data;
  }

  async signInWithGoogle() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  }

  async signInWithApple() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();

    if (error) throw error;

    await this.router.navigate([`/auth/${authRoutesTmpl.Login()}`]);
  }

  async resetPassword(email: string) {
    const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    return data;
  }

  async updatePassword(newPassword: string) {
    const { data, error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return data;
  }
}
