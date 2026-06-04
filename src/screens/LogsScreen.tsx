import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useWorkoutStore } from '../store/useWorkoutStore';

const LogsScreen = () => {
  const { logs, fetchLogsByDate, isLoading } = useWorkoutStore();
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchLogsByDate(today);
  }, []);

  if (isLoading) return <View style={styles.center}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Logs ({today})</Text>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Exercise ID: {item.exercise_id} - Set: {item.set_number} - Value: {item.reps_done_or_actual_time}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});

export default LogsScreen;
