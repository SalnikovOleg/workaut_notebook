import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { WeeklySchedule, Exercise } from '../types';
import LogSetModal from '../components/LogSetModal';

interface ScheduledExercise {
  schedule: WeeklySchedule;
  exercise: Exercise;
}

const WorkoutScreen = () => {
  const {
    scheduleService,
    logs,
    fetchLogsByDate,
    isLoading,
    error,
  } = useWorkoutStore();

  const [todaySchedule, setTodaySchedule] = useState<ScheduledExercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<{
    exercise: Exercise;
    schedule: WeeklySchedule;
  } | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const dayOfWeek = (new Date().getDay() + 6) % 7 + 1; // Convert 0-6 (Sun-Sat) to 1-7 (Mon-Sun)

  useEffect(() => {
    const loadData = async () => {
      if (!scheduleService) return;

      try {
        const data = await scheduleService.getDaySchedule(dayOfWeek);
        const mappedSchedule = data.map(item => {
          const { exercise, ...schedule } = item;
          return { exercise, schedule };
        });
        setTodaySchedule(mappedSchedule);
        await fetchLogsByDate(today);
      } catch (err) {
        console.error('Error loading workout data:', err);
      }
    };

    loadData();
  }, [scheduleService, dayOfWeek]);

  const calculateActuals = (exerciseId: number) => {
    const exerciseLogs = logs.filter((l) => l.exercise_id === exerciseId);
    const sets = exerciseLogs.length;
    const value = exerciseLogs.reduce((sum, l) => sum + (l.reps_done_or_actual_time ?? 0), 0);
    return { sets, value };
  };

  const renderExerciseCard = ({ item }: { item: ScheduledExercise }) => {
    const { exercise, schedule } = item;
    const { sets: actualSets, value: actualValue } = calculateActuals(exercise.id);
    const isCompleted =
      actualSets >= schedule.target_sets &&
      actualValue >= schedule.target_sets * schedule.target_reps_or_time;

    const unit = exercise.type === 1 ? 'Reps' : 'Sec';

    return (
      <TouchableOpacity
        style={[styles.card, isCompleted && styles.cardCompleted]}
        onPress={() => setSelectedExercise({ exercise, schedule })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          {isCompleted && (
            <Ionicons name="checkmark-circle" style={{ color: '#4CAF50', fontSize: 24 }} />
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Planned</Text>
            <Text style={styles.statValue}>
              {schedule.target_sets} Sets × {schedule.target_reps_or_time} {unit}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statValue}>
              {actualSets} Sets × {actualValue} {unit}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your workout...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Workout</Text>
        <Text style={styles.date}>{today}</Text>
      </View>

      {todaySchedule.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No exercises scheduled for today!</Text>
        </View>
      ) : (
        <FlatList
          data={todaySchedule}
          keyExtractor={(item) => item.schedule.id.toString()}
          renderItem={renderExerciseCard}
          contentContainerStyle={styles.listContent}
        />
      )}

      {selectedExercise && (
        <LogSetModal
          exercise={selectedExercise.exercise}
          scheduleItem={selectedExercise.schedule}
          isVisible={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardCompleted: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default WorkoutScreen;
