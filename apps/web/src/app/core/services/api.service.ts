import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap, map } from 'rxjs';
import { SupabaseService } from './supabase.service';
import type { WorkoutInput, WorkoutGeneratorResult } from '@trkn-shared';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly supabase = inject(SupabaseService);
  private readonly baseUrl = '/api';

  /**
   * Retrieves the authorization headers with the current user's JWT token.
   * @returns Observable of HttpHeaders with Authorization header
   * @throws Error if user is not authenticated
   */
  private getAuthHeaders(): Observable<HttpHeaders> {
    return from(this.supabase.auth.getSession()).pipe(
      map(({ data, error }) => {
        if (error || !data.session?.access_token) {
          throw new Error('Not authenticated');
        }
        return new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.session.access_token}`,
        });
      })
    );
  }

  /**
   * Generates a workout using AI based on the provided input parameters.
   * @param input - Workout input parameters (validated against WorkoutInputSchema)
   * @returns Observable of WorkoutGeneratorResult containing the generated workout
   */
  generateWorkout(input: WorkoutInput): Observable<WorkoutGeneratorResult> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<WorkoutGeneratorResult>(`${this.baseUrl}/workouts/generate`, input, { headers })
      )
    );
  }
}
