import React, { useState, useEffect, useCallback } from 'react';
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

interface LogTimeModalProps {
  exercise: Exercise;
  scheduleItem: WeeklySchedule;
  isVisible: boolean;
  onClose: () => void;
}

/**
 * Helper function to format seconds into MM:SS string.
 * @param totalSeconds - The number of elapsed seconds.
 * @returns {string} Formatted time string (e.g., "05:30").
 */
const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/**
 * Modal for logging exercise time intervals (e.g., cardio duration).
 * Matches the structural/save pattern of LogSetModal but replaces numerical input with a timer display and Play/Pause controls.
 */
const LogTimeModal = ({ exercise, scheduleItem, isVisible, onClose }: LogTimeModalProps) => {
  const { logSet, fetchLogsByDate, logs } = useWorkoutStore();

  // State for the Timer Logic
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Effect to manage the timer interval when component is mounted/unmounted or running state changes.
  useEffect(() => {
    let interval: number | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isRunning && interval) {
      clearInterval(interval);
    }

    // Cleanup function to clear the interval when the component unmounts or dependencies change.
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);


  const handlePlayPause = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  // The core save logic, mirroring LogSetModal's pattern but using time.
  const handleSave = async () => {
    if (elapsedSeconds <= 0) {
      alert('Please run the timer for at least 1 second before saving.');
      return;
    }

    // Prevent logging zero time if user somehow triggers save immediately after reset
    const numValue = Math.max(1, elapsedSeconds);

    if (numValue === 0) {
        alert('Cannot log a time of 0 seconds.');
        return;
    }


    // Calculate next set number based on existing logs for this exercise today
    const today = new Date().toISOString().split('T')[0];
    const exerciseLogsToday = logs.filter(
      (l) => l.exercise_id === exercise.id && l.timestamp.startsWith(today)
    );
    const nextSetNumber = exerciseLogsToday.length + 1;

    try {
      await logSet({
        exercise_id: exercise.id,
        set_number: nextSetNumber,
        reps_done_or_actual_time: numValue, // Use the seconds count here
        timestamp: new Date().toISOString(),
      });
      await fetchLogsByDate(today);
      onClose();
    } catch (error) {
      console.error('Failed to save set:', error);
      alert('Failed to save set: ' + (error as Error).message);
    }
  };

  // Determine the button icon and color based on running state
  const getPlayPauseIcon = () => {
    return isRunning 
    ? <Ionicons name="pause-outline" size={24} color="#fff" /> 
    : <Ionicons name="play-outline" size={24} color="#fff" />;
  };

  // Style and logic for the Play/Pause toggle button
  const renderPlayPauseButton = () => {
    return (
        <TouchableOpacity
            onPress={handlePlayPause}
            style={[styles.toggleButton, isRunning && styles.runningToggleButton]}
        >
            {getPlayPauseIcon()}
        </TouchableOpacity>
    );
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
              {renderPlayPauseButton()}
            <View style={styles.valueControl}>
              <View style={styles.timerDisplayWrapper}>
                <Text style={styles.formattedTime}>{formatTime(elapsedSeconds)}</Text>
              </View>
            </View>

          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Log Time Set</Text>
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
    maxHeight: '85%', /* Increased slightly to account for play/pause buttons */
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
  // --- Timer Specific Styles ---
  timerDisplayWrapper: {
    marginVertical: 20,
  },
  formattedTime: {
    fontSize: 64, // Large display for time
    fontWeight: 'bold',
    color: '#333',
  },
  toggleButton: {
    backgroundColor: '#34C759', // Green for start/play indicator
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  runningToggleButton: {
    backgroundColor: '#FF3B30', // Red for pause indicator
  },

  // Reusing save button styles from LogSetModal (L. 218-227)
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10, // Added small margin above save button
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  valueControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },  
});

export default LogTimeModal;