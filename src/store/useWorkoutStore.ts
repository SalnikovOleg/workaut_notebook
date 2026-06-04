import { create } from 'zustand';
import { initDatabase } from '../database/db';
import { ExerciseRepository } from '../repositories/exerciseRepository';
import { LogRepository } from '../repositories/logRepository';
import { Exercise, WorkoutLog } from '../types';

interface WorkoutState {
  exercises: Exercise[];
  logs: WorkoutLog[];
  isLoading: boolean;
  error: string | null;

  // Repositories
  exerciseRepo: ExerciseRepository | null;
  logRepo: LogRepository | null;

  // Actions
  initialize: () => Promise<void>;
  fetchExercises: () => Promise<void>;
  fetchLogsByDate: (date: string) => Promise<void>;
  addExercise: (exercise: Omit<Exercise, 'id'>) => Promise<void>;
  logSet: (log: Omit<WorkoutLog, 'id'>) => Promise<void>;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  exercises: [],
  logs: [],
  isLoading: false,
  error: null,
  exerciseRepo: null,
  logRepo: null,

  initialize: async () => {
    set({ isLoading: true });
    try {
      const db = await initDatabase();
      const exerciseRepo = new ExerciseRepository(db);
      const logRepo = new LogRepository(db);
      set({ exerciseRepo, logRepo, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  fetchExercises: async () => {
    const { exerciseRepo } = get();
    if (!exerciseRepo) return;
    try {
      const exercises = await exerciseRepo.getAllExercises();
      set({ exercises });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  fetchLogsByDate: async (date) => {
    const { logRepo } = get();
    if (!logRepo) return;
    try {
      const logs = await logRepo.getLogsByDate(date);
      set({ logs });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  addExercise: async (exercise) => {
    const { exerciseRepo } = get();
    if (!exerciseRepo) return;
    try {
      await exerciseRepo.addExercise(exercise);
      await get().fetchExercises();
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  logSet: async (log) => {
    const { logRepo } = get();
    if (!logRepo) return;
    try {
      await logRepo.logSet(log);
      // Optimistic update could be added here
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },
}));
