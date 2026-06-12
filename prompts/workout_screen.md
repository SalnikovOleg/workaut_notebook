# Implement WorkoutScreen

Create the complete functionality for `WorkoutScreen`.

## Overview

The purpose of this screen is to allow users to perform and track exercises scheduled for today.

The screen should display today's scheduled exercises and allow users to log completed sets and repetitions (or seconds for time-based exercises).

---

# Existing Repositories

Use existing repository files for all database operations:

```ts
repositories/exerciseRepository.ts
repositories/scheduleRepository.ts
repositories/logRepository.ts
```

Do not create duplicate database logic if repository methods already exist.

---

# Database Structure

## exercises

```sql
CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type INTEGER NOT NULL,
  min_sets INTEGER NOT NULL,
  min_reps_or_time INTEGER NOT NULL,
  deleted INTEGER DEFAULT 0
);
```

## weekly_schedule

```sql
CREATE TABLE IF NOT EXISTS weekly_schedule (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day_of_week INTEGER NOT NULL,
  exercise_id INTEGER NOT NULL,
  target_sets INTEGER NOT NULL,
  target_reps_or_time INTEGER NOT NULL,
  FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
);
```

## workout_logs

```sql
CREATE TABLE IF NOT EXISTS workout_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exercise_id INTEGER NOT NULL,
  set_number INTEGER NOT NULL,
  reps_done_or_actual_time INTEGER NOT NULL,
  timestamp TEXT NOT NULL,
  FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
);
```

---

# Screen Initialization

When the screen opens:

1. Determine the current day of week.
    
2. Load today's scheduled exercises from `weekly_schedule`.
    
3. Load exercise information from `exercises`.
    
4. Load today's completed workout logs from `workout_logs`.
    
5. Display all scheduled exercises with planned and actual values.
    

---

# Exercise List

Display all exercises scheduled for today.

Each exercise should be displayed as a card.

---

## Card Content

Display:

- Exercise name
    
- Planned sets
    
- Planned reps or seconds
    
- Actual completed sets
    
- Actual completed reps or seconds
    
- Completion status icon
    

Example:

```text
Push Ups

Planned:
3 Sets × 15 Reps

Completed:
2 Sets × 32 Reps

[Completion Icon]
```

---

# Exercise Type

If:

```ts
exercise.type === 1
```

Display:

```text
Reps
```

Otherwise display:

```text
Sec
```

Examples:

```text
3 Sets × 15 Reps
```

or

```text
3 Sets × 30 Sec
```

---

# Actual Values Calculation

Actual values must be calculated from `workout_logs`.

For each exercise:

## Completed Sets

Count the number of log records:

```sql
COUNT(workout_logs.id)
```

## Completed Reps / Time

Calculate:

```sql
SUM(reps_done_or_actual_time)
```

---

# Completion Status

An exercise is considered completed when:

```text
completed_sets >= target_sets
```

AND

```text
completed_reps_or_time >= target_sets * target_reps_or_time
```

When completed:

- Display a green checkmark icon.
    
- The exercise card should visually indicate completion.
    

If not completed:

- Display normal state.
    

Overachievement should also be treated as completed.

---

# Log Exercise Action

When the user taps an exercise card:

Open a modal window.

The modal allows the user to log one completed set.

Each saved record represents exactly one set.

Multiple records may be created for the same exercise.

There is no limit on the number of logged sets.

---

# Log Modal

Display:

- Exercise name
    
- Current input value selector
    
- Quick-select buttons
    
- Save button
    
- Close button
    

---

## Repetition / Time Input

Display a control like:

```text
[-]   15   [+]
```

Requirements:

- Minus button decreases value by 1.
    
- Plus button increases value by 1.
    
- User may also edit the value manually.
    
- Value must always be greater than 0.
    
- Do not allow saving 0 or negative values.
    

---

# Quick Select Buttons

Provide quick selection buttons:

```text
[5] [10] [15] [20]
```

Additionally provide:

```text
[Planned Value]
```

Where:

```text
Planned Value = target_reps_or_time
```

Example:

```text
[5] [10] [15] [20] [25]
```

if scheduled reps/time equals 25.

Pressing a quick button should immediately update the input value.

---

# Save Action

When Save is pressed:

Create a new record in `workout_logs`.

Example:

```ts
{
  exercise_id,
  set_number,
  reps_done_or_actual_time,
  timestamp
}
```

Requirements:

- Automatically determine the next set number.
    
- Save current timestamp.
    
- One save operation = one completed set.
    
- Refresh workout statistics immediately.
    
- Close the modal after successful save.
    

---

# Close Action

The modal must contain a Close button.

When pressed:

- Close modal without saving.
    
- Return to WorkoutScreen.
    

---

# Screen Refresh

After adding a workout log:

- Refresh completed sets.
    
- Refresh completed reps/time.
    
- Refresh completion status.
    
- Re-render the exercise list.
    

Updates should be visible immediately.

---

# UI Requirements

- Use React Native components compatible with Expo.
    
- Use functional components and React Hooks.
    
- Use `StyleSheet.create`.
    
- Use `expo/vector-icons`.
    
- Create a clean modern mobile UI.
    
- Follow the existing project architecture and coding style.
    
- Reuse repository methods whenever possible.
    

---

# Expected Result

The user can:

- View today's scheduled exercises.
    
- See planned sets and reps/time.
    
- See actual completed sets and reps/time.
    
- Log completed sets.
    
- Quickly enter repetitions or time values.
    
- Track progress in real time.
    
- See a green completion indicator when the planned workout is completed or exceeded.