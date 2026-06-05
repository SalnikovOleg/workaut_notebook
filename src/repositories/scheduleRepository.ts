import * as SQLite from 'expo-sqlite';

export class ScheduleRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

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
