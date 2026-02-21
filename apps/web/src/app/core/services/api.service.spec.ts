import { TestBed } from '@angular/core/testing';
import { lastValueFrom } from 'rxjs';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { SupabaseService } from './supabase.service';
import type { WorkoutInput, WorkoutGeneratorResult } from '@trkn-shared';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  const mockAccessToken = 'mock-jwt-token';
  const mockSession = {
    access_token: mockAccessToken,
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    token_type: 'bearer' as const,
    user: { id: 'user-123', email: 'test@example.com' },
  };

  const mockUser = {
    age: 30,
    weight: 180,
    weight_unit: 'lbs' as const,
    fitness_level: 3,
    physical_limitations: '',
  };

  beforeEach(() => {
    const authSpy = {
      getSession: jasmine.createSpy('getSession').and.returnValue(
        Promise.resolve({ data: { session: mockSession }, error: null })
      ),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ApiService,
        { provide: SupabaseService, useValue: jasmine.createSpyObj('SupabaseService', [], { auth: authSpy }) },
      ],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateWorkout', () => {
    it('should post to /api/workouts/generate with auth header', async () => {
      const mockInput: WorkoutInput = {
        workout_type: 'hypertrophy',
        user: mockUser,
        workout_duration: 60,
        equipment_access: 'full_gym',
        target_muscle_group: 'chest',
        tempo_focus: true,
        weight_progression_pattern: 'pyramid',
      };

      const mockResponse: WorkoutGeneratorResult = {
        workout: {
          workout_type: 'hypertrophy',
          target_muscle_group: 'chest',
          total_duration_minutes: 60,
          difficulty_rating: 4,
          warmup: [],
          exercises: [{ exercise_name: 'Bench Press', sets: [{ reps: 8, rest_duration_seconds: 90 }] }],
          cooldown: [],
          general_notes: '',
          weight_progression_pattern: 'pyramid',
          conflicting_parameters: null,
        },
        generatedAt: new Date().toISOString(),
      };

      const resultPromise = lastValueFrom(service.generateWorkout(mockInput));

      // Yield to let the getSession() Promise resolve before httpMock.expectOne()
      await Promise.resolve();

      const req = httpMock.expectOne('/api/workouts/generate');
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockAccessToken}`);
      req.flush(mockResponse);

      const result = await resultPromise;
      expect(result).toEqual(mockResponse);
    });
  });
});
