import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import ScheduleScreen from '../screens/ScheduleScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import ExercisesScreen from '../screens/ExercisesScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import DevDbScreen from '../screens/DevDbScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: ComponentProps<typeof Ionicons>['name'] = 'fitness';

          if (route.name === 'Schedule') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Workout') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Exercises') {
            iconName = focused ? 'list' : 'list-outline'; // 'dumbbell' is often 'fitness' in Ionicons
          } else if (route.name === 'Statistics') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'DevDB') {
            iconName = focused ? 'server' : 'server-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          //paddingBottom: 5,
          //height: 60,
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
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{ title: 'Statistics' }}
      />
      {__DEV__ && (
        <Tab.Screen
          name="DevDB"
          component={DevDbScreen}
          options={{ title: 'Dev DB' }}
        />
      )}
    </Tab.Navigator>
  );
}
