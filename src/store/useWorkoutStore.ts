import { create } from 'zustand';
import { initDatabase } from '../database/db';
import { ExerciseRepository } from '../repositories/exerciseRepository';
import { LogRepository } from '../repositories/logRepository';
import { ScheduleRepository } from '../repositories/scheduleRepository';
import { StatisticsRepository } from '../repositories/statisticsRepository';
import { ScheduleService } from '../services/scheduleService';
import { StatisticsService } from '../services/statisticsService';
import { Exercise, WorkoutLog } from '../types';

interface WorkoutState {
  exercises: Exercise[];
  logs: WorkoutLog[];
  isLoading: boolean;
  error: string | null;

  // Repositories
  exerciseRepo: ExerciseRepository | null;
  logRepo: LogRepository | null;
  scheduleRepo: ScheduleRepository | null;
  scheduleService: ScheduleService | null;
  statisticsService: StatisticsService | null;

  // Actions
  initialize: () => Promise<void>;
  fetchExercises: () => Promise<void>;
  fetchLogsByDate: (date: string) => Promise<void>;
  addExercise: (exercise: Omit<Exercise, 'id'>) => Promise<void>;
  updateExercise: (id: number, exercise: Partial<Exercise>) => Promise<void>;
  deleteExercise: (id: number) => Promise<void>;
  isExerciseUsed: (id: number) => Promise<boolean>;
  logSet: (log: Omit<WorkoutLog, 'id'>) => Promise<void>;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  exercises: [],
  logs: [],
  isLoading: false,
  error: null,
  exerciseRepo: null,
  logRepo: null,
  scheduleRepo: null,
  scheduleService: null,
  statisticsService: null,

  initialize: async () => {
    set({ isLoading: true });
    try {
      const db = await initDatabase();
      const exerciseRepo = new ExerciseRepository(db);
      const logRepo = new LogRepository(db);
      const scheduleRepo = new ScheduleRepository(db);
      const statisticsRepo = new StatisticsRepository(db);
      const scheduleService = new ScheduleService(scheduleRepo, exerciseRepo);
      const statisticsService = new StatisticsService(statisticsRepo);
      set({ exerciseRepo, logRepo, scheduleRepo, scheduleService, statisticsService, isLoading: false });
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

  updateExercise: async (id, exercise) => {
    const { exerciseRepo } = get();
    if (!exerciseRepo) return;
    try {
      await exerciseRepo.updateExercise(id, exercise);
      await get().fetchExercises();
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  deleteExercise: async (id) => {
    const { exerciseRepo } = get();
    if (!exerciseRepo) return;
    try {
      await exerciseRepo.softDeleteExercise(id);
      await get().fetchExercises();
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  isExerciseUsed: async (id) => {
    const { scheduleRepo } = get();
    if (!scheduleRepo) return false;
    try {
      return await scheduleRepo.isExerciseUsed(id);
    } catch (err) {
      set({ error: (err as Error).message });
      return false;
    }
  },

  logSet: async (log) => {
    const { logRepo } = get();
    if (!logRepo) return;
    try {
      await logRepo.logSet(log);
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },
}));