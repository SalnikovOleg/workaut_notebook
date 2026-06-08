import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useWorkoutStore } from '../store/useWorkoutStore';
import ExerciseFormModal from '../components/ExerciseFormModal';
import { Exercise } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { screenStyles } from '../styles/screenStyles';

const ExercisesScreen = () => {
  const { exercises, fetchExercises, isLoading, deleteExercise, isExerciseUsed } = useWorkoutStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setIsModalVisible(true);
  };

  const handleDelete = (exercise: Exercise) => {
    Alert.alert(
      'Delete Exercise',
      `Are you sure you want to delete ${exercise.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const used = await isExerciseUsed(exercise.id);
            if (used) {
              Alert.alert('Cannot Delete', 'This exercise is used in your schedule and cannot be deleted.');
              return;
            }
            await deleteExercise(exercise.id);
            Alert.alert('Deleted', 'Exercise has been removed.');
          },
        },
      ]
    );
  };

  if (isLoading) return <View style={screenStyles.center}><Text>Loading...</Text></View>;

  return (
    <View style={screenStyles.container}>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemText}>
              <Text>{item.name} - {item.min_sets} Sets / {item.min_reps_or_time} {item.type === 1 ? 'Reps' : 'Sec'}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
                <Ionicons name="create-outline" size={16} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)} style={[styles.actionButton, styles.deleteButton]}>
                <Ionicons name="trash-outline" size={16} color="#f86e67" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={screenStyles.fab}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={screenStyles.fabText}>+</Text>
      </TouchableOpacity>
      <ExerciseFormModal
        isVisible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setEditingExercise(null);
        }}
        editExercise={editingExercise}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  itemText: { flex: 1 },
  itemActions: { flexDirection: 'row', gap: 10 },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    borderColor: '#f7857f',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ExercisesScreen;
