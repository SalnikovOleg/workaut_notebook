# On page ExercisesScreen add deleteing and edition feateures
For each exercise item add 2 buttons for deleteing and edition item.

## Deleting feature
* By clicking button delete show confirmation dialog.
* After confirm call deleting function.
* Dont delete record. Only update field deleted = true

### Validation 
* Check exists exercise_id in tables weekly_schedule, calendar_schedule
* if exercise include in future schedule - prevent deletion

### Database Persistence
* Add field "deleted", type boolean to table "exercises".
* Use exists repositories repositories/exerciseRepository.ts for updating exercise.deleted
* Create rpository/scheduleRepository.ts for check exists exercisw_id in  tables weekly_schedule calendar_schedule

## Editing feature
* By clicking button edit show editing form.
* Use exists form which use for creating components/ExerciseFormModal.tsx

### Database Persistence
* Don't create new repositories
* Use exists repositories/exerciseReposittiry.ts

## 5. UI/UX
* Use React Native components compatible with Expo.
* Create a clean and modern mobile UI.
* Use `StyleSheet.create` for styling.