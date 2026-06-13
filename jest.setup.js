// Jest setup file
const { SQLite } = require('./src/__mocks__/expo-sqlite');

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});