export type ExerciseType = 1 | 2; // 1 = reps, 2 = time

export interface Exercise {
  id: number;
  name: string;
  type: ExerciseType;
  min_sets: number;
  min_reps_or_time: number;
}

export interface WeeklySchedule {
  id: number;
  day_of_week: number; // 1-7
  exercise_id: number;
  target_sets: number;
  target_reps_or_time: number;
}

export interface CalendarSchedule {
  id: number;
  date: string; // YYYY-MM-DD
  exercise_id: number;
  target_sets: number;
  target_reps_or_time: number;
}

export interface WorkoutLog {
  id: number;
  exercise_id: number;
  set_number: number;
  reps_done_or_actual_time: number;
  timestamp: string;
}

export interface StatisticsSummary {
  totalEntries: number;
  totalSets: number;
  totalRepsOrTime: number;
  distinctExercises: number;
}

export interface DailyActivity {
  date: string;
  setCount: number;
}

export interface TopExercise {
  name: string;
  setCount: number;
}
