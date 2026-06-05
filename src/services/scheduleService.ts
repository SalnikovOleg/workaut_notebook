import { ScheduleRepository, ExerciseRepository } from '../repositories';
import { WeeklySchedule, Exercise } from '../types';

export class ScheduleService {
  constructor(
    private scheduleRepo: ScheduleRepository,
    private exerciseRepo: ExerciseRepository
  ) {}

  async getDaySchedule(dayOfWeek: number): Promise<(WeeklySchedule & { exercise: Exercise })[]> {
    const schedule = await this.scheduleRepo.getScheduleByDay(dayOfWeek);
    const result = [];
    for (const item of schedule) {
      const exercise = await this.exerciseRepo.getExerciseById(item.exercise_id);
      if (exercise) {
        result.push({ ...item, exercise });
      }
    }
    return result;
  }

  async addExerciseToDay(dayOfWeek: number, exerciseId: number) {
    const exercise = await this.exerciseRepo.getExerciseById(exerciseId);
    if (!exercise) throw new Error('Exercise not found');

    if (await this.scheduleRepo.isExerciseScheduledForDay(dayOfWeek, exerciseId)) {
      throw new Error('Exercise already scheduled for this day');
    }

    return await this.scheduleRepo.addScheduledExercise({
      day_of_week: dayOfWeek,
      exercise_id: exerciseId,
      target_sets: exercise.min_sets,
      target_reps_or_time: exercise.min_reps_or_time,
    });
  }

  async updateExerciseTargets(id: number, targetSets: number, targetRepsOrTime: number) {
    return await this.scheduleRepo.updateScheduledExercise(id, targetSets, targetRepsOrTime);
  }

  async removeExerciseFromDay(id: number) {
    return await this.scheduleRepo.deleteScheduledExercise(id);
  }

  async getExerciseCounts(): Promise<{ day: number; count: number }[]> {
    const counts = [];
    for (let day = 1; day <= 7; day++) {
      const count = await this.scheduleRepo.getCountForDay(day);
      counts.push({ day, count });
    }
    return counts;
  }

  async getAllExercises() {
    return await this.exerciseRepo.getAllExercises();
  }
}
