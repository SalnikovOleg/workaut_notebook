import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Exercise } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface ExerciseSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
  exercises: Exercise[];
  scheduledExerciseIds: number[];
}

const ExerciseSelectionModal = ({
  isVisible,
  onClose,
  onSelect,
  exercises,
  scheduledExerciseIds,
}: ExerciseSelectionModalProps) => {
  return (
    <Modal visible={isVisible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Exercise</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isScheduled = scheduledExerciseIds.includes(item.id);
            return (
              <TouchableOpacity
                style={[styles.item, isScheduled && styles.itemDisabled]}
                disabled={isScheduled}
                onPress={() => onSelect(item)}
              >
                <View style={styles.itemText}>
                  <Text style={[styles.name, isScheduled && styles.textDisabled]}>{item.name}</Text>
                  <Text style={[styles.details, isScheduled && styles.textDisabled]}>
                    {item.min_sets} Sets / {item.min_reps_or_time} {item.type === 1 ? 'Reps' : 'Sec'}
                  </Text>
                </View>
                {isScheduled && <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />}
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  closeButton: { padding: 5 },
  listContent: { padding: 15 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemDisabled: {
    backgroundColor: '#e0e0e0',
    opacity: 0.7,
  },
  itemText: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#333' },
  details: { fontSize: 14, color: '#666', marginTop: 2 },
  textDisabled: { color: '#999' },
});

export default ExerciseSelectionModal;
