import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ScheduleScreen from '../screens/ScheduleScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import ExercisesScreen from '../screens/ExercisesScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';

          if (route.name === 'Schedule') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Workout') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Exercises') {
            iconName = focused ? 'fitness' : 'fitness-outline'; // 'dumbbell' is often 'fitness' in Ionicons
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen
        name="Workout"
        component={WorkoutScreen}
        options={{ title: 'Workout' }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{ title: 'Schedule' }}
      />
      <Tab.Screen
        name="Exercises"
        component={ExercisesScreen}
        options={{ title: 'Exercises' }}
      />
    </Tab.Navigator>
  );
}
