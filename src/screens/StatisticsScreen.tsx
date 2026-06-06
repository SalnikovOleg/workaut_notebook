import React, { useState, useEffect, useMemo, ComponentProps } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { screenStyles } from '../styles/screenStyles';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { StatisticsSummary, DailyActivity, TopExercise } from '../types';

const screenWidth = Dimensions.get('window').width;

type DateRange = '7' | '30' | '90' | 'custom';

const StatisticsScreen = () => {
  const { statisticsService, isLoading: storeLoading, error: storeError } = useWorkoutStore();
  const [range, setRange] = useState<DateRange>('30');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [data, setData] = useState<{
    summary: StatisticsSummary | null;
    activity: DailyActivity[];
    topExercises: TopExercise[];
  }>({
    summary: null,
    activity: [],
    topExercises: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateDates = (selectedRange: DateRange) => {
    const end = new Date();
    const start = new Date();

    if (selectedRange === '7') {
      start.setDate(end.getDate() - 7);
    } else if (selectedRange === '30') {
      start.setDate(end.getDate() - 30);
    } else if (selectedRange === '90') {
      start.setDate(end.getDate() - 90);
    } else {
      return {
        start: customRange.start || '1970-01-01',
        end: customRange.end || end.toISOString().split('T')[0],
      };
    }

    return {
      start: start.toISOString().split('T')[0] + ' 00:00:00',
      end: end.toISOString().split('T')[0] + ' 23:59:59',
    };
  };

  const fetchStats = async () => {
    if (!statisticsService) return;

    setLoading(true);
    setError(null);

    try {
      const { start, end } = calculateDates(range);
      const [summary, activity, topExercises] = await Promise.all([
        statisticsService.getSummary(start, end),
        statisticsService.getActivityTrend(start, end),
        statisticsService.getTopExercises(start, end),
      ]);

      setData({ summary, activity, topExercises });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [range]);

  const renderSummaryCard = (label: string, value: string | number, icon: ComponentProps<typeof Ionicons>['name']) => (
    <View style={styles.summaryCard}>
      <View style={styles.cardIcon}>
        <Ionicons name={icon} size={24} color="#007AFF" />
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );

  if (storeLoading || loading) {
    return (
      <View style={screenStyles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Analyzing your progress...</Text>
      </View>
    );
  }

  if (storeError || error) {
    return (
      <View style={screenStyles.center}>
        <Ionicons name="alert-circle-outline" size={64} color="red" />
        <Text style={styles.errorText}>{storeError || error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchStats}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { summary, activity, topExercises } = data;

  if (!summary || (summary.totalEntries === 0 && activity.length === 0)) {
    return (
      <View style={screenStyles.center}>
        <Ionicons name="stats-chart-outline" size={64} color="#ccc" />
        <Text style={screenStyles.emptyText}>No workout data for this period.</Text>
        <Text style={styles.emptySubtext}>Keep training to see your statistics!</Text>
      </View>
    );
  }

  // Chart Data Preparation
  const activityLabels = activity.map(d => d.date.slice(5)); // MM-DD
  const activityValues = activity.map(d => d.setCount);

  const topExerciseLabels = topExercises.map(e => e.name.length > 10 ? e.name.slice(0, 8) + '...' : e.name);
  const topExerciseValues = topExercises.map(e => e.setCount);

  return (
    <ScrollView style={screenStyles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={screenStyles.title}>Statistics</Text>

      <View style={styles.filterContainer}>
        {(['7', '30', '90', 'custom'] as const).map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.filterButton, range === r && styles.filterButtonActive]}
            onPress={() => setRange(r)}
          >
            <Text style={[styles.filterButtonText, range === r && styles.filterButtonTextActive]}>
              {r === 'custom' ? 'Custom' : `${r} Days`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.summaryGrid}>
        {renderSummaryCard('Total Logs', summary.totalEntries, 'document-text-outline')}
        {renderSummaryCard('Total Sets', summary.totalSets, 'list-circle-outline')}
        {renderSummaryCard('Reps/Time', summary.totalRepsOrTime, 'timer-outline')}
        {renderSummaryCard('Exercises', summary.distinctExercises, 'fitness-outline')}
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Activity Trend</Text>
        <LineChart
          data={{
            labels: activityLabels.length > 0 ? activityLabels : ['No Data'],
            datasets: [{ data: activityValues.length > 0 ? activityValues : [0] }],
          } as any}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientColor: '#ffffff',
            borderColor: '#e0e0e0',
            decimalPlaces: 0,
            color: '#007AFF',
            labelColors: '#666',
            style: {},
            propsForDots: { r: '4', strokeWidth: '2', stroke: '#007AFF' },
          } as any}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Top Exercises</Text>
        {topExercises.length > 0 ? (
          <BarChart
            data={{
              labels: topExerciseLabels,
              datasets: [{ data: topExerciseValues }],
            } as any}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientColor: '#ffffff',
              borderColor: '#e0e0e0',
              decimalPlaces: 0,
              color: '#007AFF',
              labelColors: '#666',
              style: {},
            } as any}
            verticalLabelRotation={30}
            yAxisLabel=""
            yAxisSuffix=""
            style={styles.chart}
          />
        ) : (
          <Text style={screenStyles.emptyText}>No exercises performed.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 30,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    width: '47%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chartSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  chart: {
    marginRight: 16,
    borderRadius: 16,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
  retryButton: {
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#999',
    marginTop: 8,
  },
});

export default StatisticsScreen;
