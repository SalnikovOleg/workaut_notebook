import { create } from 'zustand';
import { WeeklySchedule, Exercise } from '../types';

type ScheduledItem = WeeklySchedule & { exercise: Exercise };

interface ScheduleState {
  selectedDay: number;
  schedule: ScheduledItem[];
  counts: { day: number; count: number }[];

  setSelectedDay: (day: number) => void;
  setSchedule: (schedule: ScheduledItem[]) => void;
  setCounts: (counts: { day: number; count: number }[]) => void;
  updateScheduleItem: (id: number, targetSets: number, targetRepsOrTime: number) => void;
  removeScheduleItem: (id: number) => void;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  selectedDay: new Date().getDay() === 0 ? 7 : new Date().getDay(),
  schedule: [],
  counts: [],

  setSelectedDay: (day) => set({ selectedDay: day }),
  setSchedule: (schedule) => set({ schedule }),
  setCounts: (counts) => set({ counts }),

  updateScheduleItem: (id, targetSets, targetRepsOrTime) => set((state) => ({
    schedule: state.schedule.map(item =>
      item.id === id ? { ...item, target_sets: targetSets, target_reps_or_time: targetRepsOrTime } : item
    )
  })),

  removeScheduleItem: (id) => set((state) => ({
    schedule: state.schedule.filter(item => item.id !== id)
  })),
}));
