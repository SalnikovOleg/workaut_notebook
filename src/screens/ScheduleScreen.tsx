import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { useScheduleStore } from '../store/useScheduleStore';
import { ScheduleService } from '../services/scheduleService';
import ExerciseSelectionModal from '../components/ExerciseSelectionModal';
import { Exercise } from '../types';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ScheduleScreen = () => {
  const { exerciseRepo, scheduleRepo } = useWorkoutStore();
  const {
    selectedDay,
    setSelectedDay,
    schedule,
    setSchedule,
    counts,
    setCounts,
    updateScheduleItem,
    removeScheduleItem,
  } = useScheduleStore();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);

  const service = useMemo(() => {
    if (!exerciseRepo || !scheduleRepo) return null;
    return new ScheduleService(scheduleRepo, exerciseRepo);
  }, [exerciseRepo, scheduleRepo]);

  useEffect(() => {
    if (service) {
      loadCounts();
      loadDaySchedule(selectedDay);
    }
  }, [service, selectedDay]);

  const loadCounts = async () => {
    try {
      const dayCounts = await service?.getExerciseCounts();
      setCounts(dayCounts);
    } catch (err) {
      console.error('Failed to load counts:', err);
    }
  };

  const loadDaySchedule = async (day: number) => {
    try {
      const daySchedule = await service?.getDaySchedule(day);
      setSchedule(daySchedule || []);
    } catch (err) {
      console.error('Failed to load day schedule:', err);
    }
  };

  const loadAllExercises = async () => {
    try {
      const exercises = await service?.getAllExercises();
      setAllExercises(exercises || []);
    } catch (err) {
      console.error('Failed to load all exercises:', err);
    }
  };

  const handleDayPress = (day: number) => {
    setSelectedDay(day);
  };

  const handleOpenModal = async () => {
    await loadAllExercises();
    setIsModalVisible(true);
  };

  const handleAddExercise = async (exercise: Exercise) => {
    try {
      await service?.addExerciseToDay(selectedDay, exercise.id);
      setIsModalVisible(false);
      await loadDaySchedule(selectedDay);
      await loadCounts();
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    }
  };

  const handleUpdateTargets = async (id: number, sets: number, reps: number) => {
    try {
      await service?.updateExerciseTargets(id, sets, reps);
      updateScheduleItem(id, sets, reps);
    } catch (err) {
      Alert.alert('Error', 'Failed to update targets');
    }
  };

  const handleDeleteExercise = (item: any) => {
    Alert.alert(
      'Remove Exercise',
      `Remove ${item.exercise.name} from this day?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await service?.removeExerciseFromDay(item.id);
              removeScheduleItem(item.id);
              await loadCounts();
            } catch (err) {
              Alert.alert('Error', 'Failed to remove exercise');
            }
          },
        },
      ]
    );
  };

  const getCountForDay = (day: number) => {
    const countObj = counts.find((c) => c.day === day);
    return countObj ? countObj.count : 0;
  };

  if (!service) {
    return (
      <View style={styles.center}>
        <Text>Initializing database...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Schedule</Text>

      <View style={styles.daySelector}>
        <View style={styles.dayRow}>
          {[1, 2, 3, 4].map((day) => (
            <TouchableOpacity
              key={day}
              style={[styles.dayButton, selectedDay === day && styles.dayButtonSelected]}
              onPress={() => handleDayPress(day)}
            >
              <Text style={[styles.dayText, selectedDay === day && styles.dayTextSelected]}>
                {DAYS[day - 1]}
              </Text>
              <Text style={[styles.countText, selectedDay === day && styles.countTextSelected]}>
                {getCountForDay(day)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.dayRow}>
          {[5, 6, 7].map((day) => (
            <TouchableOpacity
              key={day}
              style={[styles.dayButton, selectedDay === day && styles.dayButtonSelected]}
              onPress={() => handleDayPress(day)}
            >
              <Text style={[styles.dayText, selectedDay === day && styles.dayTextSelected]}>
                {DAYS[day - 1]}
              </Text>
              <Text style={[styles.countText, selectedDay === day && styles.countTextSelected]}>
                {getCountForDay(day)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={schedule}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.exerciseName}>{item.exercise.name}</Text>

            <View style={styles.controlsContainer}>
              <View style={styles.controlGroup}>
                <Text style={styles.controlLabel}>Sets</Text>
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={styles.stepButton}
                    onPress={() => handleUpdateTargets(item.id, Math.max(1, item.target_sets - 1), item.target_reps_or_time)}
                  >
                    <Ionicons name="remove" size={20} color="#333" />
                  </TouchableOpacity>
                  <Text style={styles.stepValue}>{item.target_sets}</Text>
                  <TouchableOpacity
                    style={styles.stepButton}
                    onPress={() => handleUpdateTargets(item.id, item.target_sets + 1, item.target_reps_or_time)}
                  >
                    <Ionicons name="add" size={20} color="#333" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.controlGroup}>
                <Text style={styles.controlLabel}>
                  {item.exercise.type === 1 ? 'Reps' : 'Sec'}
                </Text>
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={styles.stepButton}
                    onPress={() => handleUpdateTargets(item.id, item.target_sets, Math.max(1, item.target_reps_or_time - 1))}
                  >
                    <Ionicons name="remove" size={20} color="#333" />
                  </TouchableOpacity>
                  <Text style={styles.stepValue}>{item.target_reps_or_time}</Text>
                  <TouchableOpacity
                    style={styles.stepButton}
                    onPress={() => handleUpdateTargets(item.id, item.target_sets, item.target_reps_or_time + 1)}
                  >
                    <Ionicons name="add" size={20} color="#333" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteExercise(item)}
            >
              <Ionicons name="trash-outline" size={20} color="#f86e67" />
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No exercises scheduled for this day.</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={handleOpenModal}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <ExerciseSelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelect={handleAddExercise}
        exercises={allExercises}
        scheduledExerciseIds={schedule.map(i => i.exercise_id)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333', textAlign: 'center' },
  daySelector: { marginBottom: 20 },
  dayRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  dayButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dayButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  dayText: { fontSize: 14, fontWeight: '600', color: '#666' },
  dayTextSelected: { color: 'white' },
  countText: { fontSize: 12, color: '#999' },
  countTextSelected: { color: 'rgba(255,255,255,0.8)' },
  listContent: { paddingBottom: 100 },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  controlGroup: {
    alignItems: 'center',
    flex: 1,
  },
  controlLabel: { fontSize: 14, color: '#666', marginBottom: 5 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  stepButton: {
    width: 32,
    height: 32,
    backgroundColor: 'white',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  stepValue: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    minWidth: 20,
    textAlign: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  deleteText: {
    fontSize: 14,
    color: '#f86e67',
    fontWeight: '600',
    marginLeft: 5,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default ScheduleScreen;
