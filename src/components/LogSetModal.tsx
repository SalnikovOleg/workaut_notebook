import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { WeeklySchedule, Exercise } from '../types';

interface LogSetModalProps {
  exercise: Exercise;
  scheduleItem: WeeklySchedule;
  isVisible: boolean;
  onClose: () => void;
}

const LogSetModal = ({ exercise, scheduleItem, isVisible, onClose }: LogSetModalProps) => {
  const { logSet, fetchLogsByDate, logs } = useWorkoutStore();
  const [value, setValue] = useState('');

  useEffect(() => {
    if (isVisible) {
      setValue(scheduleItem.target_reps_or_time.toString());
    }
  }, [isVisible, scheduleItem]);

  const handleSave = async () => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue <= 0) {
      alert('Please enter a value greater than 0');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const exerciseLogsToday = logs.filter(
      (l) => l.exercise_id === exercise.id && l.timestamp.startsWith(today)
    );
    const nextSetNumber = exerciseLogsToday.length + 1;

    try {
      await logSet({
        exercise_id: exercise.id,
        set_number: nextSetNumber,
        reps_done_or_actual_time: numValue,
        timestamp: new Date().toISOString(),
      });
      await fetchLogsByDate(today);
      onClose();
    } catch (error) {
      alert('Failed to save set: ' + (error as Error).message);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{exercise.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>

            <View style={styles.quickSelectRow}>
              {[5, 10, 15, 20].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.quickButton}
                  onPress={() => setValue(num.toString())}
                >
                  <Text style={styles.quickButtonText}>{num}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.quickButton, styles.plannedButton]}
                onPress={() => setValue(scheduleItem.target_reps_or_time.toString())}
              >
                <Text style={styles.plannedButtonText}>{scheduleItem.target_reps_or_time.toString()}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.valueControl}>
              <TouchableOpacity
                style={styles.stepButton}
                onPress={() => setValue(prev => (Math.max(1, parseInt(prev || '0', 10) - 1)).toString())}
              >
                <Ionicons name="remove" size={24} color="#fff" />
              </TouchableOpacity>

              <TextInput
                style={styles.valueInput}
                value={value}
                onChangeText={setValue}
                keyboardType="numeric"
              />

              <TouchableOpacity
                style={styles.stepButton}
                onPress={() => setValue(prev => (parseInt(prev || '0', 10) + 1).toString())}
              >
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Set</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '80%',
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
  content: {
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  valueControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  stepButton: {
    backgroundColor: '#007AFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueInput: {
    fontSize: 32,
    fontWeight: 'bold',
    width: 80,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  quickSelectLabel: {
    fontSize: 14,
    color: '#999',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  quickSelectRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 30,
  },
  quickButton: {
    backgroundColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  quickButtonText: {
    fontSize: 14,
    color: '#333',
  },
  plannedButton: {
    backgroundColor: '#e1f5fe',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  plannedButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LogSetModal;
