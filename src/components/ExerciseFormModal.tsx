import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { Exercise } from '../types';

interface ExerciseFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  editExercise?: Exercise | null;
}

const ExerciseFormModal = ({ isVisible, onClose, editExercise }: ExerciseFormModalProps) => {
  const { addExercise, updateExercise } = useWorkoutStore();

  const [name, setName] = useState('');
  const [type, setType] = useState(1); // 1: Reps, 2: Time
  const [minSets, setMinSets] = useState('');
  const [minRepsOrTime, setMinRepsOrTime] = useState('');

  useEffect(() => {
    if (isVisible) {
      if (editExercise) {
        setName(editExercise.name);
        setType(editExercise.type);
        setMinSets(editExercise.min_sets.toString());
        setMinRepsOrTime(editExercise.min_reps_or_time.toString());
      } else {
        // Reset form when opening for create
        setName('');
        setType(1);
        setMinSets('');
        setMinRepsOrTime('');
      }
    }
  }, [isVisible, editExercise]);

  const validate = () => {
    if (name.trim().length === 0) return 'Exercise name is required';
    if (name.length > 30) return 'Name must be 30 characters or less';
    if (!minSets || isNaN(Number(minSets)) || Number(minSets) <= 0) return 'Minimum sets must be a positive integer';
    if (!minRepsOrTime || isNaN(Number(minRepsOrTime)) || Number(minRepsOrTime) <= 0) return 'Minimum repetitions/time must be a positive integer';
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      Alert.alert('Invalid Input', error);
      return;
    }

    try {
      const exerciseData = {
        name: name.trim(),
        type: type,
        min_sets: parseInt(minSets, 10),
        min_reps_or_time: parseInt(minRepsOrTime, 10),
      };

      if (editExercise) {
        await updateExercise(editExercise.id, exerciseData);
        Alert.alert('Success', 'Exercise updated successfully!');
      } else {
        await addExercise(exerciseData);
        Alert.alert('Success', 'Exercise created successfully!');
      }
      onClose();
    } catch {
      Alert.alert('Error', editExercise ? 'Failed to update exercise' : 'Failed to create exercise');
    }
  };

  const isFormValid =
    name.trim().length > 0 &&
    name.length <= 30 &&
    minSets !== '' && !isNaN(Number(minSets)) && Number(minSets) > 0 &&
    minRepsOrTime !== '' && !isNaN(Number(minRepsOrTime)) && Number(minRepsOrTime) > 0;

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContent}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Text style={styles.title}>{editExercise ? 'Edit Exercise' : 'Create New Exercise'}</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButton}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Exercise Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Bench Press"
                value={name}
                onChangeText={setName}
                maxLength={30}
              />
              <Text style={styles.charCount}>{name.length}/30</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Type</Text>
              <View style={styles.segmentedControl}>
                <TouchableOpacity
                  style={[styles.segment, type === 1 && styles.segmentActive]}
                  onPress={() => setType(1)}
                >
                  <Text style={[styles.segmentText, type === 1 && styles.segmentTextActive]}>Reps</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segment, type === 2 && styles.segmentActive]}
                  onPress={() => setType(2)}
                >
                  <Text style={[styles.segmentText, type === 2 && styles.segmentTextActive]}>Time (s)</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Minimum Sets</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 3"
                value={minSets}
                onChangeText={setMinSets}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                {type === 1 ? 'Minimum Repetitions' : 'Minimum Time (seconds)'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={type === 1 ? "e.g. 10" : "e.g. 60"}
                value={minRepsOrTime}
                onChangeText={setMinRepsOrTime}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={[styles.saveButton, !isFormValid && styles.saveButtonDisabled]}
              onPress={handleSubmit}
              disabled={!isFormValid}
            >
              <Text style={styles.saveButtonText}>Save Exercise</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    color: '#666',
  },
  segmentTextActive: {
    color: '#000',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#B0C4DE',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExerciseFormModal;
