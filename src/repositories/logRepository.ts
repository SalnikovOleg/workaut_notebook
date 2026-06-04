import * as SQLite from 'expo-sqlite';
import { WorkoutLog } from '../types';

export class LogRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  async logSet(log: Omit<WorkoutLog, 'id'>): Promise<number> {
    const result = await this.db.runAsync(
      'INSERT INTO workout_logs (exercise_id, set_number, reps_done_or_actual_time, timestamp) VALUES (?, ?, ?, ?)',
      [log.exercise_id, log.set_number, log.reps_done_or_actual_time, log.timestamp]
    );
    return result.lastInsertRowId;
  }

  async getLogsByDate(date: string): Promise<WorkoutLog[]> {
    return await this.db.getAllAsync<WorkoutLog>(
      'SELECT * FROM workout_logs WHERE date(timestamp) = ?',
      [date]
    );
  }

  async getLogsForExercise(exerciseId: number): Promise<WorkoutLog[]> {
    return await this.db.getAllAsync<WorkoutLog>(
      'SELECT * FROM workout_logs WHERE exercise_id = ? ORDER BY timestamp DESC',
      [exerciseId]
    );
  }

  async deleteLog(id: number): Promise<void> {
    await this.db.runAsync('DELETE FROM workout_logs WHERE id = ?', [id]);
  }
}
