# React Native + Expo Navigation Menu Component

I have a React Native + Expo application using `@react-navigation/native-stack`.

In `App.js`, the navigator is configured as follows:

```jsx
<Stack.Navigator initialRouteName="Exercises">
  <Stack.Screen
    name="Schedule"
    component={ScheduleScreen}
    options={{ title: 'Workout Schedule' }}
  />
  <Stack.Screen
    name="Logs"
    component={LogsScreen}
    options={{ title: 'Workout Logs' }}
  />
  <Stack.Screen
    name="Exercises"
    component={ExercisesScreen}
    options={{ title: 'Exercise Library' }}
  />
</Stack.Navigator>
```

I need to create a tabs component called `MainTabs` with 3 tabs for navigation 
to each of these screens

## Requirements

1. install @react-navigation/bottom-tabs
2. Create `MainTabs.js` with 3 tabs:
  - ScheduleScreen with icon alendar или calendar-month;
  - LogsScreen with icon trending-up / bar-chart;linked
  - ExercisesScreen   with icon dumbbell;
3. Style the buttons using `StyleSheet.create` and provide a clean, modern design.


## Expected Output

Please provide:

- The complete code for `MainTabs.js`
- CHange App.js to add Tabs
- The necessary imports
- The styles created with `StyleSheet.create`
```