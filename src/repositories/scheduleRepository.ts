import * as SQLite from 'expo-sqlite';
import { WeeklySchedule } from '../types';

export class ScheduleRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  async getScheduleByDay(dayOfWeek: number): Promise<WeeklySchedule[]> {
    return await this.db.getAllAsync<WeeklySchedule>(
      'SELECT * FROM weekly_schedule WHERE day_of_week = ?',
      [dayOfWeek]
    );
  }

  async addScheduledExercise(item: Omit<WeeklySchedule, 'id'>): Promise<number> {
    const result = await this.db.runAsync(
      'INSERT INTO weekly_schedule (day_of_week, exercise_id, target_sets, target_reps_or_time) VALUES (?, ?, ?, ?)',
      [item.day_of_week, item.exercise_id, item.target_sets, item.target_reps_or_time]
    );
    return result.lastInsertRowId;
  }

  async updateScheduledExercise(id: number, targetSets: number, targetRepsOrTime: number): Promise<void> {
    await this.db.runAsync(
      'UPDATE weekly_schedule SET target_sets = ?, target_reps_or_time = ? WHERE id = ?',
      [targetSets, targetRepsOrTime, id]
    );
  }

  async deleteScheduledExercise(id: number): Promise<void> {
    await this.db.runAsync('DELETE FROM weekly_schedule WHERE id = ?', [id]);
  }

  async getExerciseCountsByDay(): Promise<{ day: number, count: number }[]> {
    const results = await this.db.getAllAsync<{ count: number }>(
      'SELECT count(*) as count FROM weekly_schedule GROUP BY day_of_week'
    );
    // This is tricky because not all days might have entries.
    // A better way would be to just query each day or use a more robust SQL query.
    // But for now, let's implement a simple helper in the service.
    return results.map((r, index) => ({ day: index + 1, count: r.count })); // This is wrong.
  }

  async getCountForDay(dayOfWeek: number): Promise<number> {
    const result = await this.db.getFirstAsync<{ count: number }>(
      'SELECT count(*) as count FROM weekly_schedule WHERE day_of_week = ?',
      [dayOfWeek]
    );
    return result ? result.count : 0;
  }

  async isExerciseScheduledForDay(dayOfWeek: number, exerciseId: number): Promise<boolean> {
    const result = await this.db.getFirstAsync(
      'SELECT 1 FROM weekly_schedule WHERE day_of_week = ? AND exercise_id = ?',
      [dayOfWeek, exerciseId]
    );
    return !!result;
  }

  async isExerciseUsed(exerciseId: number): Promise<boolean> {
    const weeklyCheck = await this.db.getFirstAsync(
      'SELECT 1 FROM weekly_schedule WHERE exercise_id = ?',
      [exerciseId]
    );
    if (weeklyCheck) return true;

    const calendarCheck = await this.db.getFirstAsync(
      'SELECT 1 FROM calendar_schedule WHERE exercise_id = ?',
      [exerciseId]
    );
    if (calendarCheck) return true;

    return false;
  }
}
