import * as SQLite from 'expo-sqlite';
import { Exercise } from '../types';

export class ExerciseRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  async getAllExercises(): Promise<Exercise[]> {
    const stmt = await this.db.prepareAsync('SELECT * FROM exercises WHERE deleted = 0');
    try {
      const result = await stmt.executeAsync();
      const rows: Exercise[] = [];
      for await (const row of result) {
        rows.push(row as Exercise);
      }
      return rows;
    } finally {
      await stmt.finalizeAsync();
    }
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
    type SQLitePrimitive = string | number | boolean | null;
    const fields = Object.keys(exercise) as Array<keyof Exercise>;
    const filteredFields = fields.filter(key => key !== 'id');
    const values = filteredFields.map(key => (exercise[key] as SQLitePrimitive));
    const setClause = filteredFields.map(field => `${String(field)} = ?`).join(', ');

    await this.db.runAsync(`UPDATE exercises SET ${setClause} WHERE id = ?`, [...values, id]);
  }

  async deleteExercise(id: number): Promise<void> {
    await this.db.runAsync('DELETE FROM exercises WHERE id = ?', [id]);
  }

  async softDeleteExercise(id: number): Promise<void> {
    await this.db.runAsync('UPDATE exercises SET deleted = 1 WHERE id = ?', [id]);
  }
}
