import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { screenStyles } from '../styles/screenStyles';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { WeeklySchedule, Exercise } from '../types';
import LogSetModal from '../components/LogSetModal';
import ExerciseCard from '../components/ExerciseCard';

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

  useFocusEffect(
    useCallback(() => {
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
    }, [scheduleService, dayOfWeek, today, fetchLogsByDate])
  );

  const calculateActuals = (exerciseId: number) => {
    const exerciseLogs = logs.filter((l) => l.exercise_id === exerciseId);
    const sets = exerciseLogs.length;
    const value = exerciseLogs.reduce((sum, l) => sum + (l.reps_done_or_actual_time ?? 0), 0);
    return { sets, value };
  };

  const renderExerciseCard = ({ item }: { item: ScheduledExercise }) => {
    const { exercise, schedule } = item;
    const { sets: actualSets, value: actualValue } = calculateActuals(exercise.id);

    return (
      <ExerciseCard
        exercise={exercise}
        schedule={schedule}
        actualSets={actualSets}
        actualValue={actualValue}
        onPress={() => setSelectedExercise({ exercise, schedule })}
      />
    );
  };

  if (isLoading) {
    return (
      <View style={screenStyles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your workout...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={screenStyles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={screenStyles.container}>
          <Text style={styles.date}>{today}</Text>
          <Text style={screenStyles.title}>Let's workout</Text>

      {todaySchedule.length === 0 ? (
        <View style={screenStyles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={screenStyles.emptyText}>No exercises scheduled for today!</Text>
        </View>
      ) : (
        <FlatList
          data={todaySchedule}
          keyExtractor={(item) => item.schedule.id.toString()}
          renderItem={renderExerciseCard}
          contentContainerStyle={screenStyles.listContent}
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
  date: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 10,
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
});

export default WorkoutScreen;
