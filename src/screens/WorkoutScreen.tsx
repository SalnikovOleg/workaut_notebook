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
import { WeeklySchedule, Exercise, ScheduledExercise } from '../types';
import LogSetModal from '../components/LogSetModal';
import LogTimeModal from '../components/LogTimeModal';
import ExerciseCard from '../components/ExerciseCard';

const WorkoutScreen = () => {
  const {
    fetchTodaySchedule,
    fetchLogsByDate,
    todaySchedule,
    logsActuals,
    isLoading,
    error,
  } = useWorkoutStore();

  const [selectedExercise, setSelectedExercise] = useState<{
    exercise: Exercise;
    schedule: WeeklySchedule;
  } | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const dayOfWeek = (new Date().getDay() + 6) % 7 + 1; // Convert 0-6 (Sun-Sat) to 1-7 (Mon-Sun)

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          await fetchTodaySchedule(dayOfWeek);
          await fetchLogsByDate(today);
        } catch (err) {
          console.error('Error loading workout data:', err);
        }
      };

      loadData();
    }, [dayOfWeek, today, fetchTodaySchedule, fetchLogsByDate])
  );

  const renderExerciseCard = ({ item }: { item: ScheduledExercise }) => {
    // Guard clause: Check if necessary properties exist to prevent ReferenceError
    if (!item || !item.exercise || !item.schedule) {
      console.warn("Skipping exercise card rendering due to missing data on item:", item);
      return null;
    }

    const { exercise, schedule } = item;
    // Assuming logsActuals[exercise.id] exists structure-wise if the error was not about undefined properties
    const { sets: actualSets = 0, value: actualValue = 0 } = logsActuals[exercise.id] || {};

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
        // Check exercise type for conditional rendering logic
        selectedExercise.exercise.type === 2 ? ( // Time-based logging case
          <LogTimeModal
            exercise={selectedExercise.exercise}
            scheduleItem={selectedExercise.schedule}
            isVisible={!!selectedExercise}
            onClose={() => setSelectedExercise(null)}
          />
        ) : ( // Set count based logging case (original behavior)
          <LogSetModal
            exercise={selectedExercise.exercise}
            scheduleItem={selectedExercise.schedule}
            isVisible={!!selectedExercise}
            onClose={() => setSelectedExercise(null)}
          />
        )
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
