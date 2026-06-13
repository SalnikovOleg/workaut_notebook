// Mock for expo-sqlite
const mockExecuteAsync = jest.fn();
const mockPrepareAsync = jest.fn().mockResolvedValue({
  executeAsync: mockExecuteAsync,
  finalizeAsync: jest.fn(),
});

const mockGetFirstAsync = jest.fn();
const mockRunAsync = jest.fn();

// This matches what import * as SQLite from 'expo-sqlite' expects
// Based on the actual exports: openDatabaseAsync and openDatabaseSync
const SQLiteMock = {
  openDatabaseAsync: jest.fn().mockResolvedValue({
    prepareAsync: mockPrepareAsync,
    getFirstAsync: mockGetFirstAsync,
    runAsync: mockRunAsync,
  }),
  openDatabaseSync: jest.fn().mockReturnValue({
    prepareAsync: mockPrepareAsync,
    getFirstAsync: mockGetFirstAsync,
    runAsync: mockRunAsync,
  }),
  // Export the mock functions so tests can access and configure them
  __mockExecuteAsync: mockExecuteAsync,
  __mockPrepareAsync: mockPrepareAsync,
  __mockGetFirstAsync: mockGetFirstAsync,
  __mockRunAsync: mockRunAsync,
};

export default SQLiteMock;