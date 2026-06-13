module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^expo$': 'expo-expo',
    '^expo-sqlite$': '<rootDir>/src/__mocks__/expo-sqlite.ts',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/screens/**', // Exclude screens for now, focus on services/repositories
    '!src/store/**',   // Exclude store for now
    '!src/components/**', // Exclude components for now
    '!src/types/**',   // Exclude types
    '!src/styles/**',  // Exclude styles
  ],
};