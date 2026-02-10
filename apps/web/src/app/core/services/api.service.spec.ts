import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { SupabaseService } from './supabase.service';
import type { WorkoutInput, WorkoutGeneratorResult } from '@trkn-shared';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let supabaseService: jasmine.SpyObj<SupabaseService>;

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
        Promise.resolve({
          data: { session: mockSession },
          error: null,
        })
      ),
    };

    const supabaseSpy = jasmine.createSpyObj('SupabaseService', [], {
      auth: authSpy,
    });

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ApiService,
        { provide: SupabaseService, useValue: supabaseSpy },
      ],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    supabaseService = TestBed.inject(SupabaseService) as jasmine.SpyObj<SupabaseService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateWorkout', () => {
    it('should generate a hypertrophy workout with correct headers', (done) => {
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
          warmup: ['Dynamic stretching for 5 minutes', 'Light cardio warm-up'],
          exercises: [
            {
              exercise_name: 'Bench Press',
              sets: [
                { reps: 8, rest_duration_seconds: 90 },
                { reps: 8, rest_duration_seconds: 90 },
                { reps: 8, rest_duration_seconds: 90 },
                { reps: 8, rest_duration_seconds: 90 },
              ],
              notes: 'Focus on controlled tempo',
            },
          ],
          cooldown: ['Static stretching for 5 minutes'],
          general_notes: 'Focus on mind-muscle connection',
          weight_progression_pattern: 'pyramid',
          conflicting_parameters: null,
        },
        generatedAt: new Date().toISOString(),
      };

      service.generateWorkout(mockInput).subscribe({
        next: (result) => {
          expect(result).toEqual(mockResponse);
          expect(result.workout.workout_type).toBe('hypertrophy');
          if (result.workout.workout_type === 'hypertrophy' || result.workout.workout_type === 'strength') {
            expect(result.workout.exercises.length).toBeGreaterThan(0);
          }
          done();
        },
        error: done.fail,
      });

      const req = httpMock.expectOne('/api/workouts/generate');
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockAccessToken}`);
      expect(req.request.body).toEqual(mockInput);
      req.flush(mockResponse);
    });

    it('should generate a strength workout', (done) => {
      const mockInput: WorkoutInput = {
        workout_type: 'strength',
        user: { ...mockUser, age: 25, weight: 200, fitness_level: 4 },
        workout_duration: 45,
        equipment_access: 'full_gym',
        target_muscle_group: 'legs',
        load_percentage: 85,
        weight_progression_pattern: 'straight_sets',
      };

      const mockResponse: WorkoutGeneratorResult = {
        workout: {
          workout_type: 'strength',
          target_muscle_group: 'legs',
          total_duration_minutes: 45,
          difficulty_rating: 5,
          warmup: ['Mobility work for 10 minutes', 'Dynamic stretching'],
          exercises: [
            {
              exercise_name: 'Back Squat',
              sets: [
                { reps: 5, rest_duration_seconds: 180 },
                { reps: 5, rest_duration_seconds: 180 },
                { reps: 5, rest_duration_seconds: 180 },
                { reps: 5, rest_duration_seconds: 180 },
                { reps: 5, rest_duration_seconds: 180 },
              ],
              notes: 'Heavy singles',
            },
          ],
          cooldown: ['Light cardio for 5 minutes'],
          general_notes: 'Focus on explosive concentric',
          weight_progression_pattern: 'straight_sets',
          conflicting_parameters: null,
        },
        generatedAt: new Date().toISOString(),
      };

      service.generateWorkout(mockInput).subscribe({
        next: (result) => {
          expect(result).toEqual(mockResponse);
          expect(result.workout.workout_type).toBe('strength');
          done();
        },
        error: done.fail,
      });

      const req = httpMock.expectOne('/api/workouts/generate');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should generate a conditioning workout', (done) => {
      const mockInput: WorkoutInput = {
        workout_type: 'conditioning',
        user: { ...mockUser, age: 28, weight: 160 },
        workout_duration: 30,
        equipment_access: 'minimal_space',
        interval_structure: 'tabata',
        cardio_modality: 'mixed',
      };

      const mockResponse: WorkoutGeneratorResult = {
        workout: {
          workout_type: 'conditioning',
          cardio_modality: 'mixed',
          total_duration_minutes: 30,
          difficulty_rating: 4,
          warmup: ['Light jog for 5 minutes'],
          intervals: [
            {
              interval_number: 1,
              work_duration_seconds: 20,
              rest_duration_seconds: 40,
              intensity: 'high',
              modality: 'mixed',
              notes: 'Full body movement',
            },
          ],
          cooldown: ['Walking for 5 minutes'],
          general_notes: 'Push hard during work intervals',
          conflicting_parameters: null,
        },
        generatedAt: new Date().toISOString(),
      };

      service.generateWorkout(mockInput).subscribe({
        next: (result) => {
          expect(result).toEqual(mockResponse);
          expect(result.workout.workout_type).toBe('conditioning');
          done();
        },
        error: done.fail,
      });

      const req = httpMock.expectOne('/api/workouts/generate');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should throw error when user is not authenticated', (done) => {
      // Mock no session
      const authSpy = supabaseService.auth as jasmine.SpyObj<typeof supabaseService.auth>;
      authSpy.getSession = jasmine.createSpy('getSession').and.returnValue(
        Promise.resolve({
          data: { session: null },
          error: null,
        })
      );

      const mockInput: WorkoutInput = {
        workout_type: 'hypertrophy',
        user: mockUser,
        workout_duration: 60,
        equipment_access: 'full_gym',
        target_muscle_group: 'chest',
        tempo_focus: true,
        weight_progression_pattern: 'pyramid',
      };

      service.generateWorkout(mockInput).subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (error) => {
          expect(error.message).toBe('Not authenticated');
          done();
        },
      });
    });

    it('should handle HTTP error responses', (done) => {
      const mockInput: WorkoutInput = {
        workout_type: 'hypertrophy',
        user: mockUser,
        workout_duration: 60,
        equipment_access: 'full_gym',
        target_muscle_group: 'chest',
        tempo_focus: true,
        weight_progression_pattern: 'pyramid',
      };

      const mockErrorResponse = {
        error: {
          message: 'Invalid workout parameters',
          code: 'VALIDATION_ERROR',
        },
      };

      service.generateWorkout(mockInput).subscribe({
        next: () => done.fail('Should have failed with 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error).toEqual(mockErrorResponse);
          done();
        },
      });

      const req = httpMock.expectOne('/api/workouts/generate');
      req.flush(mockErrorResponse, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle network errors', (done) => {
      const mockInput: WorkoutInput = {
        workout_type: 'hypertrophy',
        user: mockUser,
        workout_duration: 60,
        equipment_access: 'full_gym',
        target_muscle_group: 'chest',
        tempo_focus: true,
        weight_progression_pattern: 'pyramid',
      };

      service.generateWorkout(mockInput).subscribe({
        next: () => done.fail('Should have failed with network error'),
        error: (error) => {
          expect(error.error).toBeInstanceOf(ProgressEvent);
          done();
        },
      });

      const req = httpMock.expectOne('/api/workouts/generate');
      req.error(new ProgressEvent('error'));
    });
  });
});
