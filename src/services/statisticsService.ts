import { StatisticsRepository } from '../repositories/statisticsRepository';
import { StatisticsSummary, DailyActivity, TopExercise } from '../types';

export class StatisticsService {
  constructor(private statsRepo: StatisticsRepository) {}

  async getSummary(startDate: string, endDate: string): Promise<StatisticsSummary> {
    return this.statsRepo.getSummaryStats(startDate, endDate);
  }

  async getActivityTrend(startDate: string, endDate: string): Promise<DailyActivity[]> {
    return this.statsRepo.getDailyActivity(startDate, endDate);
  }

  async getTopExercises(startDate: string, endDate: string): Promise<TopExercise[]> {
    return this.statsRepo.getTopExercises(startDate, endDate);
  }
}
