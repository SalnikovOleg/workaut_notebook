# Add Exercise Creation Feature

Implement a feature on the `ExercisesScreen` that allows users to create a new exercise.

## 1. Add "Create Exercise" Button

On the `ExercisesScreen`, place a floating **"+" button (FAB)** in the bottom-right corner of the screen.

When the user taps the button, open a form for creating a new exercise.

---

## 2. Exercise Creation Form

The form should contain the following fields:

### name

* Text input field.
* Maximum length: **30 characters**.
* Required field.
* Used for the exercise name.

### type

Use a **segmented control** instead of a dropdown.

The control should display two visible options:

* Reps
* Time (seconds)

#### Requirements

* Exactly one option must be selected.
* Default selection: **Reps**.
* Implement using React Native components (`Pressable`, `TouchableOpacity`, etc.).
* Style it as a modern segmented control with two horizontal tabs.
* The selected option should be visually highlighted.
* Store values as:

  * `1` = Reps
  * `2` = Time (seconds)

When the selected type changes, update the label of the `min_reps_or_time` field dynamically:

* Reps → **"Minimum Repetitions"**
* Time → **"Minimum Time (seconds)"**

### min_sets

* Numeric input.
* Accepts only positive integers.
* Required field.
* Represents the minimum number of sets.

### min_reps_or_time

* Numeric input.
* Accepts only positive integers.
* Required field.
* Meaning depends on the selected `type`:

  * If `type = 1`, it represents the minimum number of repetitions.
  * If `type = 2`, it represents the minimum duration in seconds.

---

## 3. Validation

Implement client-side validation:

* `name` is required.
* `name` length must not exceed 30 characters.
* `type` is required.
* `min_sets` must be a positive integer greater than 0.
* `min_reps_or_time` must be a positive integer greater than 0.

Display user-friendly validation messages.

---

## 4. Database Persistence

Save the exercise into the existing SQLite table:

```sql
CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type INTEGER NOT NULL,
  min_sets INTEGER NOT NULL,
  min_reps_or_time INTEGER NOT NULL
);
```

Do not create a new repository or duplicate database logic.

Use the existing repository:

```text
src/repository/exerciseRepository.ts
```

All database operations must be performed through this repository.

---

## 5. UI/UX

* Use React Native components compatible with Expo.
* Create a clean and modern mobile UI.
* Use `StyleSheet.create` for styling.

The form may be displayed as:

* A modal
* A dedicated screen
* A bottom sheet

Choose the approach that best fits the current project structure.

---

### 6. Form Submission

Add a "Save Exercise" button.

The button should remain disabled until all required fields contain valid values.

## 7. After Successful Save

After the exercise is successfully created:

1. Persist the record using `exerciseRepository`.
2. Close the form.
3. Refresh the exercise list on `ExercisesScreen`.
4. Display a success message (`Toast`, `Alert`, or `Snackbar`).
5. The newly created exercise should immediately appear in the list.

---

## Expected Output

Provide:

* Complete implementation.
* Any new component(s) created.
* Changes required in `ExercisesScreen`.
* Repository method usage.
* Validation logic.
* Styling using `StyleSheet.create`.
* Brief explanation of implementation decisions.
