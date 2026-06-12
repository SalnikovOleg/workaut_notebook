import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { screenStyles } from '../styles/screenStyles';
import { WeeklySchedule, Exercise } from '../types';

interface ExerciseCardProps {
  exercise: Exercise;
  schedule: WeeklySchedule;
  actualSets: number;
  actualValue: number;
  onPress: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  schedule,
  actualSets,
  actualValue,
  onPress,
}) => {
  const isCompleted =
    actualSets >= schedule.target_sets &&
    actualValue >= schedule.target_sets * schedule.target_reps_or_time;

  const unit = exercise.type === 1 ? 'Reps' : 'Sec';

  return (
    <TouchableOpacity
      style={[screenStyles.card, isCompleted && styles.cardCompleted]}
      onPress={onPress}
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
            {actualSets} Sets  |  {actualValue} {unit}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});

export default ExerciseCard;
