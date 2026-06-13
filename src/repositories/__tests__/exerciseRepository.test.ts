import { ExerciseRepository } from '../exerciseRepository';
import { Exercise } from '../../types';

// Define the shape of the mocked database methods we need
type MockSQLiteDatabase = {
  prepareAsync: jest.Mock;
  getFirstAsync: jest.Mock;
  runAsync: jest.Mock;
};

describe('ExerciseRepository', () => {
  let db: MockSQLiteDatabase;
  let repository: ExerciseRepository;

  beforeEach(() => {
    // Setup mock database
    db = {
      prepareAsync: jest.fn(),
      getFirstAsync: jest.fn(),
      runAsync: jest.fn(),
    };

    // Initialize repository with mocked db
    repository = new ExerciseRepository(db as any);
  });

  describe('getAllExercises', () => {
    it('should return an array of exercises', async () => {
      // Arrange
      const mockExercises: Exercise[] = [
        { id: 1, name: 'Push Ups', type: 1, minSets: 3, minRepsOrTime: 10 },
        { id: 2, name: 'Squats', type: 1, minSets: 4, minRepsOrTime: 15 },
      ];

      // Database rows come back with snake_case property names
      const mockDbRows = [
        { id: 1, name: 'Push Ups', type: 1, min_sets: 3, min_reps_or_time: 10, deleted: 0 },
        { id: 2, name: 'Squats', type: 1, min_sets: 4, min_reps_or_time: 15, deleted: 0 },
      ];

      const mockResult = {
        executeAsync: jest.fn().mockReturnValue({
          [Symbol.asyncIterator]: () => ({
            next: jest.fn()
              .mockResolvedValueOnce({ value: mockDbRows[0], done: false })
              .mockResolvedValueOnce({ value: mockDbRows[1], done: false })
              .mockResolvedValueOnce({ value: undefined, done: true }),
          }),
        }),
        finalizeAsync: jest.fn(),
      };

      db.prepareAsync.mockResolvedValue(mockResult);

      // Act
      const result = await repository.getAllExercises();

      // Assert
      expect(db.prepareAsync).toHaveBeenCalledWith('SELECT * FROM exercises WHERE deleted = 0');
      expect(result).toEqual(mockExercises);
    });
  });

  describe('getExerciseById', () => {
    it('should return an exercise when found', async () => {
      // Arrange
      const mockExercise: Exercise = { id: 1, name: 'Push Ups', type: 1, minSets: 3, minRepsOrTime: 10 };
      // Database row comes back with snake_case property names
      const mockDbRow = { id: 1, name: 'Push Ups', type: 1, min_sets: 3, min_reps_or_time: 10, deleted: 0 };
      db.getFirstAsync.mockResolvedValue(mockDbRow);

      // Act
      const result = await repository.getExerciseById(1);

      // Assert
      expect(db.getFirstAsync).toHaveBeenCalledWith('SELECT * FROM exercises WHERE id = ?', [1]);
      expect(result).toEqual(mockExercise);
    });

    it('should return null when exercise not found', async () => {
      // Arrange
      db.getFirstAsync.mockResolvedValue(null);

      // Act
      const result = await repository.getExerciseById(999);

      // Assert
      expect(db.getFirstAsync).toHaveBeenCalledWith('SELECT * FROM exercises WHERE id = ?', [999]);
      expect(result).toBeNull();
    });
  });

  describe('addExercise', () => {
    it('should insert a new exercise and return the ID', async () => {
      // Arrange
      const mockExercise: Omit<Exercise, 'id'> = {
        name: 'Bench Press',
        type: 1,
        minSets: 3,
        minRepsOrTime: 10,
      };
      const mockResult = { lastInsertRowId: 123 };
      db.runAsync.mockResolvedValue(mockResult);

      // Act
      const result = await repository.addExercise(mockExercise);

      // Assert
      expect(db.runAsync).toHaveBeenCalledWith(
        'INSERT INTO exercises (name, type, min_sets, min_reps_or_time) VALUES (?, ?, ?, ?)',
        [mockExercise.name, mockExercise.type, mockExercise.minSets, mockExercise.minRepsOrTime]
      );
      expect(result).toBe(123);
    });
  });
});