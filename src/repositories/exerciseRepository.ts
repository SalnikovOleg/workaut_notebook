import * as SQLite from 'expo-sqlite';
import { Exercise } from '../types';

export class ExerciseRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  async getAllExercises(): Promise<Exercise[]> {
    return await this.db.getAllAsync<Exercise>('SELECT * FROM exercises');
  }

  async getExerciseById(id: number): Promise<Exercise | null> {
    const result = await this.db.getFirstAsync<Exercise>('SELECT * FROM exercises WHERE id = ?', [id]);
    return result || null;
  }

  async addExercise(exercise: Omit<Exercise, 'id'>): Promise<number> {
    const result = await this.db.runAsync(
      'INSERT INTO exercises (name, type, min_sets, min_reps_or_time) VALUES (?, ?, ?, ?)',
      [exercise.name, exercise.type, exercise.min_sets, exercise.min_reps_or_time]
    );
    return result.lastInsertRowId;
  }

  async updateExercise(id: number, exercise: Partial<Exercise>): Promise<void> {
    const fields = Object.keys(exercise).filter(key => key !== 'id');
    const values = fields.map(key => (exercise as any)[key]);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    await this.db.runAsync(`UPDATE exercises SET ${setClause} WHERE id = ?`, [...values, id]);
  }

  async deleteExercise(id: number): Promise<void> {
    await this.db.runAsync('DELETE FROM exercises WHERE id = ?', [id]);
  }
}
