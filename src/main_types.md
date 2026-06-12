# Main TypeScript Types

This file documents the core TypeScript types used in the Scheduler application.

## Exercise Types

### `ExerciseType`
Represents the type of measurement for an exercise.
- `1`: Repetitions (reps)
- `2`: Time

## Core Interfaces

### `Exercise`
Represents a single exercise definition.
- `id`: `number` - Unique identifier for the exercise.
- `name`: `string` - Name of the exercise.
- `type`: `ExerciseType` - Whether it's based on reps or time.
- `min_sets`: `number` - Minimum number of sets required.
- `min_reps_or_time`: `number` - Minimum reps or time per set.

### `WeeklySchedule`
Represents an exercise scheduled for a specific day of the week.
- `id`: `number` - Unique identifier.
- `day_of_week`: `number` - Day of the week (1-7).
- `exercise_id`: `number` - Reference to the exercise.
- `target_sets`: `number` - Target number of sets.
- `target_reps_or_time`: `number` - Target reps or time.

### `CalendarSchedule`
Represents an exercise scheduled for a specific date.
- `id`: `number` - Unique identifier.
- `date`: `string` - Date in `YYYY-MM-DD` format.
- `exercise_id`: `number` - Reference to the exercise.
- `target_sets`: `number` - Target number of sets.
- `target_reps_or_time`: `number` - Target reps or time.

### `WorkoutLog`
Represents a single set performed during a workout.
- `id`: `number` - Unique identifier.
- `exercise_id`: `number` - Reference to the exercise.
- `set_number`: `number` - The sequence number of the set.
- `reps_done_or_actual_time`: `number` - Actual reps or time completed.
- `timestamp`: `string` - ISO timestamp of when the set was performed.

## Statistics Interfaces

### `StatisticsSummary`
A summary of workout statistics.
- `totalEntries`: `number` - Total number of logged sets.
- `totalSets`: `number` - Total number of sets.
- `totalRepsOrTime`: `number` - Cumulative reps or time.
- `distinctExercises`: `number` - Number of unique exercises logged.

### `DailyActivity`
Activity summary for a specific day.
- `date`: `string` - Date in `YYYY-MM-DD` format.
- `setCount`: `number` - Number of sets performed on this day.

### `TopExercise`
Information about the most frequently performed exercises.
- `name`: `string` - Name of the exercise.
- `setCount`: `number` - Number of sets performed.
