You are working on an existing React Native (Expo) application.

Before making changes, read and follow all project conventions described in Claude.md.

Task: Implement a new Statistics screen that displays workout execution statistics based on data stored in the SQLite database.

Important project structure requirements:

- Screens are located in the `screens/` directory.
    
- Database access must be implemented through repositories located in the `repositories/` directory.
    
- If an appropriate repository already exists, extend it.
    
- If no suitable repository exists, create a new repository dedicated to workout statistics.
    
- Do not place SQL queries directly inside React components.
    
- Follow existing project architecture and coding style.
    

Navigation requirements:

- Add a new `Tab.Screen` to the existing `Tab.Navigator`.
    
- The navigator is located in `components/MainTabs.tsx`.
    
- Use an icon representing analytics, charts, statistics, or graphs.
    
- Tab title: `Statistics`.
    

Database information:

Workout execution data is stored in the table:

```sql
CREATE TABLE IF NOT EXISTS workout_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exercise_id INTEGER NOT NULL,
  set_number INTEGER NOT NULL,
  reps_done_or_actual_time INTEGER NOT NULL,
  timestamp TEXT NOT NULL,
  FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
);
```

The statistics screen should support the following date ranges:

- Last 7 days
    
- Last 30 days
    
- Last 90 days
    
- Custom date range (start date / end date)
    

Default selection should be Last 30 days.

Screen requirements:

# 1. Summary cards

Display the following KPI cards for the selected period:

- Total workout log entries
    
- Total completed sets
    
- Total repetitions / accumulated exercise time
    
- Number of distinct exercises performed
    

These cards should be displayed at the top of the screen.

# 2. Activity trend chart

Display workout activity over time.

Requirements:

- X-axis: day
    
- Y-axis: number of completed sets
    
- Respect selected date range
    
- Aggregate data by day
    
- Use an existing chart library if already present in the project
    
- If no chart library exists, install and integrate a lightweight chart library suitable for Expo
    

# 3. Top exercises section

Display the most frequently performed exercises during the selected period.

For each exercise show:

- Exercise name
    
- Number of completed sets
    

Sort descending by completed sets.

A horizontal bar chart is preferred if a chart library is available.  
Otherwise use a ranked list.

# 4. Filters

Provide a date range selector above the statistics content.

Required options:

- 7 Days
    
- 30 Days
    
- 90 Days
    
- Custom
    

Changing the period must refresh all statistics.

# 5. Repository layer

Create repository methods that return:

- Summary statistics
    
- Daily activity data
    
- Top exercises data
    

Repository methods should be reusable and independent from UI components.

# 6. Loading and error states

Implement:

- Loading indicator while data is being fetched
    
- Error handling with user-friendly messages
    
- Empty-state UI when no workout data exists for the selected period
    

# 7. Code quality

Requirements:

- Use TypeScript types/interfaces where appropriate.
    
- Reuse existing UI components if available.
    
- Keep components small and maintainable.
    
- Avoid duplicated SQL queries.
    
- Follow project naming conventions from Claude.md.
    
- Add concise comments only where logic is not obvious.
    

Deliverables:

1. New Statistics screen in the `screens/` folder.
    
2. Required repository implementation in the `repositories/` folder.
    
3. Integration into `components/MainTabs.tsx`.
    
4. Any required chart integration.
    
5. Fully working feature with clean architecture and production-quality code.