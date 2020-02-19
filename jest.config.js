module.exports = {
  preset: "@shelf/jest-mongodb",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
      diagnostics: false,
    },
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testEnvironment: "node",
  collectCoverageFrom: ["**/src/**", "!src/index.ts"],
  testMatch: ["**/src/**/*.test.js", "**/src/**/*.test.ts"],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  setupFilesAfterEnv: ["./dbSetup.ts"],
};
