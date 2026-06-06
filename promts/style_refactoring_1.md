# Refactor Screen Styles - Phase 1

Perform a CSS/StyleSheet refactoring of the React Native project.

## Goal

Standardize and centralize styles used by the main application screens.

This is the first phase of a larger styling refactor.

---

## Scope

Refactor the following screens:

- `screens/ExercisesScreen`
- `screens/ScheduleScreen`
- `screens/WorkoutScreen`

---

## Requirements

### 1. Create a Shared Styles File

Extract common styles from the screens above into a shared style file.

For example:

```
src/styles/screenStyles.ts
```

or another appropriate location based on the current project structure.

The shared file should contain reusable styles for:

- Screen containers
- Page titles
- Section titles
- Buttons
- Lists
- Cards
- Form elements
- Common spacing and layout patterns

Avoid duplicating identical style definitions across screens.

---
### 2. Use Styles form ExercisesScreen as the base value

The appearance of `ScheduleScreen` and `WorkoutScreen` should be adjusted to match the style conventions already used in `ExercisesScreen`.

---
### 3. Reduce Style Duplication

Identify styles that are duplicated or nearly identical.

Replace them with shared reusable styles from the common style file.

The goal is to improve maintainability and reduce repeated code.

---

### 4. Preserve Existing Functionality

Do not modify:

- Business logic
- Navigation
- State management
- Repository/database code

Only refactor styling and style organization.

Visual appearance should remain functionally equivalent, with improvements limited to consistency and maintainability.

---

## Deliverables

Provide:

1. The new shared style file.
2. Updated versions of:
    - `ExercisesScreen`
    - `ScheduleScreen`
    - `WorkoutScreen`
3. Explanation of which styles were centralized.
4. Explanation of any style inconsistencies that were corrected.
5. Confirmation that no business logic was modified.

---

## Important

Before making changes:

1. Analyze the styles currently used in all three screens.
2. Identify duplicate and similar style definitions.
3. Create a shared style system based on `ExercisesScreen`.
4. Refactor the screens to use the shared styles.
5. Remove obsolete style definitions that are no longer needed.

Prefer maintainability and consistency over introducing new visual designs.