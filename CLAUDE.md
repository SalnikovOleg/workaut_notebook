# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands
- `npm start`: Start the Expo development server
- `npm run android`: Start and run on Android
- `npm run ios`: Start and run on iOS
- `npm run web`: Start and run on Web
- `npm run lint`: Lint the codebase
- `npm run lint:fix`: Automatically fix linting errors

## Architecture
The project follows a strict separation of concerns using a Repository Pattern:
`Entities (Types)` → `Database/Repositories` → `Services` → `Zustand Store` → `Screens`

### Directory Structure
- `src/types`: Domain entities and TypeScript interfaces.
- `src/database`: SQLite initialization and migration logic (`expo-sqlite`).
- `src/repositories`: Data access layer for executing SQL queries (CRUD operations).
- `src/services`: Business logic that may orchestrate multiple repositories.
- `src/store`: State management using Zustand.
- `src/screens`: UI components and screens.
- `src/components`: UI components like a modal forms and Main tabs.
- `src/styles`: Common styles.

### Data Model
The app manages four core domains:
1. **Reference**: Exercise definitions (`exercises` table).
2. **Plan**: Schedules (`weekly_schedule` and `calendar_schedule` tables).
3. **Fact**: Workout logs (`workout_logs` table, where 1 set = 1 record).
3. **Statistic**: Statistic. 

## Key Technologies
- **Framework**: Expo (React Native)
- **Database**: `expo-sqlite` (Modern async API)
- **State Management**: Zustand
- **Navigation**: React Navigation (@react-navigation/native)
