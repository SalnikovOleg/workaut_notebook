# Implement ScheduleScreen

Create the complete functionality for `ScheduleScreen`.

## Overview

The screen allows users to manage a weekly exercise schedule.

A user can:

- View scheduled exercises for each day of the week.
    
- Add exercises to a selected day.
    
- Remove exercises from a selected day.
    
- Change target sets and reps/time for scheduled exercises.
    

---

# Database

The repository already exists:

```ts
repositories/scheduleRepository.ts
```

Table structure:

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

Use the existing repository methods whenever possible.

---

# Screen Initialization

When the screen opens:

1. Automatically determine the current day of week.
    
2. Select the current day.
    
3. Load scheduled exercises for the selected day.
    
4. Display them on the screen.
    

---

# Day Selector

At the top of the screen display 7 rounded buttons:

```
Mon  Tue  Wed  Thu
Fri  Sat  Sun
```

Requirements:

- Display buttons in two rows.
    
- First row: 4 buttons.
    
- Second row: 3 buttons.
    
- Selected day must be highlighted.
    
- Each day button should display the number of scheduled exercises for that day.
    
- When the user taps a day:
    
    - update selected day;
        
    - load exercises for that day;
        
    - refresh the exercise list.
        

---

# Scheduled Exercise Cards

Display all exercises scheduled for the selected day.

Each exercise should be displayed as a card.

Card content:

- Exercise name
    
- Delete button
    
- Sets control
    
- Reps/Time control
    

Example:

```text
Push Ups

Sets
[-] 3 [+]

Reps
[-] 15 [+]

[Delete]
```

---

## Sets Control

Label:

```text
Sets
```

Display:

```text
[-] {target_sets} [+]
```

Behavior:

- "+" increases value by 1.
    
- "-" decreases value by 1.
    
- Minimum value is 1.
    
- Persist changes immediately to `weekly_schedule`.
    

---

## Reps / Time Control

Label:

```text
Reps
```

if:

```ts
exercise.type === 1
```

otherwise:

```text
Sec
```

Display:

```text
[-] {target_reps_or_time} [+]
```

Behavior:

- "+" increases value by 1.
    
- "-" decreases value by 1.
    
- Minimum value is 1.
    
- Persist changes immediately to `weekly_schedule`.
    

---

# Delete Exercise

When the user taps Delete:

1. Show confirmation dialog.
    
2. If confirmed:
    
    - remove record from `weekly_schedule`;
        
    - refresh the schedule list.
        

---

# Add Exercise

Display a Floating Action Button (FAB) in the bottom-right corner.

When tapped:

- Open exercise selection UI.
    
- It may be:
    
    - Modal
        
    - Bottom Sheet
        
    - Separate Screen
        

Choose the option that best matches the existing project architecture.

---

## Exercise Source

Load exercises using:

```ts
repositories/exerciseRepository.ts
```

---

## Exercise List Item

Display:

```text
{name}
{min_sets} Sets / {min_reps_or_time} Reps
```

or

```text
{name}
{min_sets} Sets / {min_reps_or_time} Sec
```

depending on:

```ts
exercise.type === 1
```

---

## Adding Exercise

When the user selects an exercise:

Create a new record in `weekly_schedule`:

```ts
day_of_week = selectedDay
exercise_id = exercise.id
target_sets = exercise.min_sets
target_reps_or_time = exercise.min_reps_or_time
```

Then:

1. Close the selection form.
    
2. Reload the selected day schedule.
    
3. Show the newly added exercise.
    

---

## Duplicate Protection

Do NOT allow adding an exercise that already exists for the selected day.

The exercise list should either:

- hide already scheduled exercises; or
    
- disable them.
    

---

# UI Requirements

- Use React Native components compatible with Expo.
    
- Use functional components and React Hooks.
    
- Use `StyleSheet.create`.
    
- Use `expo/vector-icons`.
    
- Create a clean modern mobile UI.
    
- Keep the implementation consistent with the existing project architecture.
    
- Reuse existing repositories and patterns used in the project.
    

---

# Expected Result

The user can:

- Switch between days.
    
- View scheduled exercises.
    
- Add exercises.
    
- Remove exercises.
    
- Adjust sets and reps/time.
    
- All changes are persisted in SQLite through the existing repositories.