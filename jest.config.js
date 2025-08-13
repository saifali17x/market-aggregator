// jest.config.js
module.exports = {
  testEnvironment: "node",
  testTimeout: 30000,
  collectCoverage: true,
  coverageDirectory: "<rootDir>/coverage",
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/build/"],
  setupFiles: ["<rootDir>/backend/jest.setup.js"],
  setupFilesAfterEnv: [],
  moduleNameMapper: {
    "^../models$": "<rootDir>/backend/__mocks__/models.js",
    "^../config/database$": "<rootDir>/backend/__mocks__/database.js",
  },
  testEnvironment: "node",
  clearMocks: true,
  restoreMocks: true,
};
