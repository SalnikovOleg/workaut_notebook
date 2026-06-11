We need to refactor the exercise logging functionality.

### Objective
In `screens/WorkoutScreen`, implement conditional rendering for the logging modal based on `exercise.type`. 

### Requirements

1. **Conditional Modal Rendering in `screens/WorkoutScreen`**:
   - For `exercise.type === 1`: Keep using the existing `components/LogSetModal`.
   - For `exercise.type === 2`: Create and use a new modal component named `LogTimeModal` (you can place it in `components/LogTimeModal`).

2. **Create `components/LogTimeModal`**:
   - **Design & Data Handling**: It must share the exact same UI styling, structure, and data saving logic (`handleSave` function / submission handler) as the existing `LogSetModal`, but with different input elements.
   - **Inputs/Controls to Include**:
     - A Play/Pause toggle button.
     - A timer display showing the elapsed time in seconds (or MM:SS format).
     - A Save button to log the data.

3. **Timer Logic & Behavior inside `LogTimeModal`**:
   - Initial state: The Play/Pause button shows a **Play** icon, and the timer is at 0.
   - When the Play button is pressed:
     - The icon switches to a **Pause** icon.
     - A timer starts, incrementing every second.
     - The screen updates in real-time to display the current seconds.
   - When the Pause button is pressed:
     - The timer stops/pauses.
     - The icon switches back to the **Play** icon.
   - When the **Save** button is pressed:
     - Execute the standard `handleSave` logic, passing the tracked time value.
     - Automatically close/dismiss the modal.

Please review the existing `components/LogSetModal` and `screens/WorkoutScreen` first to ensure the new `LogTimeModal` matches the styling props, theme, and data-handling methods exactly. Generate the clean, production-ready code for the new component and the updated screen.