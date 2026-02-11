# Revision API Test Examples

This file contains example payloads for testing the revision endpoints during development.

## Prerequisites

1. Start local Supabase: `cd supabase && supabase start`
2. Start Vercel dev server: `pnpm dev:vercel`
3. Get an auth token by logging into the app or using Supabase Studio

## Test 1: Revise Full Workout (Make it Harder)

### Endpoint
```
POST http://localhost:3000/api/workouts/revise
```

### Headers
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### Body
```json
{
  "workout": {
    "workout_type": "hypertrophy",
    "target_muscle_group": "chest",
    "total_duration_minutes": 45,
    "difficulty_rating": 3,
    "warmup": [
      "5 minutes light cardio",
      "Arm circles - 2x10 each direction"
    ],
    "exercises": [
      {
        "exercise_name": "Barbell Bench Press",
        "sets": [
          {
            "reps": 12,
            "rest_duration_seconds": 90,
            "suggested_weight": 135,
            "weight_unit": "lbs"
          },
          {
            "reps": 10,
            "rest_duration_seconds": 90,
            "suggested_weight": 145,
            "weight_unit": "lbs"
          },
          {
            "reps": 8,
            "rest_duration_seconds": 90,
            "suggested_weight": 155,
            "weight_unit": "lbs"
          }
        ],
        "notes": "Keep elbows at 45-degree angle"
      },
      {
        "exercise_name": "Dumbbell Flyes",
        "sets": [
          {
            "reps": 12,
            "rest_duration_seconds": 60,
            "suggested_weight": 25,
            "weight_unit": "lbs"
          },
          {
            "reps": 12,
            "rest_duration_seconds": 60,
            "suggested_weight": 25,
            "weight_unit": "lbs"
          },
          {
            "reps": 12,
            "rest_duration_seconds": 60,
            "suggested_weight": 25,
            "weight_unit": "lbs"
          }
        ],
        "notes": "Stretch at the bottom of each rep"
      }
    ],
    "cooldown": [
      "Chest stretch - 30 seconds each side",
      "Light stretching"
    ],
    "general_notes": "Focus on mind-muscle connection throughout the workout",
    "weight_progression_pattern": "pyramid",
    "estimated_volume": "6 working sets",
    "conflicting_parameters": null
  },
  "original_input": {
    "user": {
      "age": 30,
      "weight": 180,
      "weight_unit": "lbs",
      "fitness_level": 3,
      "physical_limitations": "None"
    },
    "workout_type": "hypertrophy",
    "workout_duration": 45,
    "equipment_access": "full_gym",
    "equipment_notes": "All equipment available",
    "target_muscle_group": "chest",
    "tempo_focus": false,
    "weight_progression_pattern": "pyramid"
  },
  "revision_text": "Make it harder by adding more weight and reducing rest times"
}
```

### Expected Result
- Increased weights across all sets
- Reduced rest_duration_seconds
- Possibly higher difficulty_rating
- Same workout structure preserved

---

## Test 2: Revise Full Workout (Add Exercises)

### Body
```json
{
  "workout": {
    // ... same as above
  },
  "original_input": {
    // ... same as above
  },
  "revision_text": "Add one more exercise targeting upper chest"
}
```

### Expected Result
- New exercise added (e.g., Incline Bench Press)
- Existing exercises preserved
- Updated estimated_volume

---

## Test 3: Revise Single Exercise

### Endpoint
```
POST http://localhost:3000/api/workouts/revise-exercise
```

### Body
```json
{
  "exercise": {
    "exercise_name": "Barbell Bench Press",
    "sets": [
      {
        "reps": 12,
        "rest_duration_seconds": 90,
        "suggested_weight": 135,
        "weight_unit": "lbs"
      },
      {
        "reps": 10,
        "rest_duration_seconds": 90,
        "suggested_weight": 145,
        "weight_unit": "lbs"
      },
      {
        "reps": 8,
        "rest_duration_seconds": 90,
        "suggested_weight": 155,
        "weight_unit": "lbs"
      }
    ],
    "notes": "Keep elbows at 45-degree angle"
  },
  "workout_context": {
    "workout_type": "hypertrophy",
    "target_muscle_group": "chest",
    "total_duration_minutes": 45,
    "difficulty_rating": 3,
    "warmup": ["5 minutes light cardio"],
    "exercises": [
      {
        "exercise_name": "Barbell Bench Press",
        "sets": [
          {
            "reps": 12,
            "rest_duration_seconds": 90,
            "suggested_weight": 135,
            "weight_unit": "lbs"
          }
        ],
        "notes": "Keep elbows at 45-degree angle"
      }
    ],
    "cooldown": ["Chest stretch"],
    "general_notes": "Focus on form",
    "weight_progression_pattern": "pyramid",
    "estimated_volume": "6 working sets",
    "conflicting_parameters": null
  },
  "original_input": {
    "user": {
      "age": 30,
      "weight": 180,
      "weight_unit": "lbs",
      "fitness_level": 3,
      "physical_limitations": "None"
    },
    "workout_type": "hypertrophy",
    "workout_duration": 45,
    "equipment_access": "full_gym",
    "equipment_notes": "All equipment available",
    "target_muscle_group": "chest",
    "tempo_focus": false,
    "weight_progression_pattern": "pyramid"
  },
  "revision_text": "Replace with dumbbell bench press"
}
```

### Expected Result
- exercise_name changed to "Dumbbell Bench Press"
- Sets adjusted for dumbbells (typically lower weight)
- Notes updated with dumbbell-specific cues
- Set count and structure preserved

---

## Test 4: Invalid Input (Missing Required Field)

### Body
```json
{
  "workout": {
    "workout_type": "hypertrophy"
    // ... missing other required fields
  },
  "original_input": {
    // ... complete original input
  },
  "revision_text": "Make it harder"
}
```

### Expected Result
- HTTP 400
- Zod validation error details

---

## Test 5: Invalid Input (Revision Text Too Long)

### Body
```json
{
  "workout": {
    // ... valid workout
  },
  "original_input": {
    // ... valid input
  },
  "revision_text": "Lorem ipsum dolor sit amet... [501 characters]"
}
```

### Expected Result
- HTTP 400
- Error: "String must contain at most 500 character(s)"

---

## Test 6: Unauthenticated Request

### Headers
```
Content-Type: application/json
```
(No Authorization header)

### Expected Result
- HTTP 401
- Error: "Missing or invalid Authorization header"

---

## Testing with curl

### Workout Revision
```bash
curl -X POST http://localhost:3000/api/workouts/revise \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d @test-workout-revision.json
```

### Exercise Revision
```bash
curl -X POST http://localhost:3000/api/workouts/revise-exercise \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d @test-exercise-revision.json
```

---

## Notes

- Replace `YOUR_JWT_TOKEN` with a valid token from Supabase auth
- Ensure local Supabase and Vercel dev server are running
- Check `ANTHROPIC_API_KEY` is set in `.env.local`
- Monitor console for AI invocation logs
- First request may be slower (prompt loading + model initialization)
