Act as a Senior React Native Developer. I am building a mobile application using Expo, expo-sqlite, and Zustand. 

The core philosophy of the app is the strict separation of:
1. Reference (Exercises definitions)
2. Plan (Schedules)
3. Fact (Workout logs)

Architectural Pattern:
We will use a Repository Pattern layer: Entities (Types) -> Database/Repositories -> Services -> Zustand Store -> Screens.

Your task is to generate the boilerplate code and folder structure for this baseline setup.

### 1. Folder Structure
Generate the following file tree under the `src` directory:
- `/src/types` (Domain entities and TypeScript interfaces)
- `/src/database` (SQLite initialization and migration logic)
- `/src/repositories` (Data access layer for executing SQL queries)
- `/src/services` (Business logic combining multiple repositories if needed)
- `/src/store` (Zustand state management)
- `/src/screens` (UI placeholder screens)

### 2. Database Schema (expo-sqlite)
Initialize the SQLite database with the following tables. Ensure you use the modern asynchronous API of `expo-sqlite`:

- **exercises**: `id` (INTEGER PRIMARY KEY), `name` (TEXT), `type` (INTEGER: 1 = reps, 2 = time), `min_sets` (INTEGER), `min_reps_or_time` (INTEGER).
- **weekly_schedule**: `id` (INTEGER PRIMARY KEY), `day_of_week` (INTEGER: 1-7), `exercise_id` (INTEGER FK), `target_sets` (INTEGER), `target_reps_or_time` (INTEGER).
- **calendar_schedule**: `id` (INTEGER PRIMARY KEY), `date` (TEXT: YYYY-MM-DD), `exercise_id` (INTEGER FK), `target_sets` (INTEGER), `target_reps_or_time` (INTEGER) -> *Used for one-time overrides*.
- **workout_logs**: `id` (INTEGER PRIMARY KEY), `exercise_id` (INTEGER FK), `set_number` (INTEGER), `reps_done_or_actual_time` (INTEGER), `timestamp` (TEXT/INTEGER) -> *Strictly "1 set = 1 record" approach*.

### 3. Requirements for Code Generation

Please provide the implementation for the following core files:

1. **`src/types/index.ts`**: TypeScript types reflecting the DB schema and UI states.
2. **`src/database/db.ts`**: Database open connection and tables creation script (`PRAGMA foreign_keys = ON;`).
3. **`src/repositories/exerciseRepository.ts`** & **`src/repositories/logRepository.ts`**: Repositories containing standard CRUD functions (e.g., `getAllExercises`, `addExercise`, `logSet`, `getLogsByDate`).
4. **`src/store/useWorkoutStore.ts`**: A Zustand store that calls the repositories, holds the global state for the active screen, and handles optimistic UI updates if necessary.
5. **`src/screens/`**: Basic functional component placeholders for `ExercisesScreen.tsx`, `ScheduleScreen.tsx`, and `LogsScreen.tsx` to prove the data wiring works.

Keep the code modern, clean, clean-typed, and use descriptive naming conventions. Write out full code i