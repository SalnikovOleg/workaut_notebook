import * as SQLite from 'expo-sqlite';
import { StatisticsSummary, DailyActivity, TopExercise } from '../types';

export class StatisticsRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  async getSummaryStats(startDate: string, endDate: string): Promise<StatisticsSummary> {
    const result = await this.db.getFirstAsync<{
      totalEntries: number;
      totalSets: number;
      totalRepsOrTime: number;
      distinctExercises: number;
    }>(
      `SELECT
        COUNT(*) as totalEntries,
        COUNT(*) as totalSets,
        SUM(reps_done_or_actual_time) as totalRepsOrTime,
        COUNT(DISTINCT exercise_id) as distinctExercises
       FROM workout_logs
       WHERE timestamp >= ? AND timestamp <= ?`,
      [startDate, endDate]
    );

    return {
      totalEntries: result?.totalEntries || 0,
      totalSets: result?.totalSets || 0,
      totalRepsOrTime: result?.totalRepsOrTime || 0,
      distinctExercises: result?.distinctExercises || 0,
    };
  }

  async getDailyActivity(startDate: string, endDate: string): Promise<DailyActivity[]> {
    return await this.db.getAllAsync<DailyActivity>(
      `SELECT date(timestamp) as date, COUNT(*) as setCount
       FROM workout_logs
       WHERE timestamp >= ? AND timestamp <= ?
       GROUP BY date
       ORDER BY date`,
      [startDate, endDate]
    );
  }

  async getTopExercises(startDate: string, endDate: string): Promise<TopExercise[]> {
    return await this.db.getAllAsync<TopExercise>(
      `SELECT e.name, COUNT(l.id) as setCount
       FROM workout_logs l
       JOIN exercises e ON l.exercise_id = e.id
       WHERE l.timestamp >= ? AND l.timestamp <= ?
       GROUP BY l.exercise_id
       ORDER BY setCount DESC`,
      [startDate, endDate]
    );
  }
}
