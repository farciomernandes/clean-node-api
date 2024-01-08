module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/*-protocols.ts',
    '!<rootDir>/**/protocols/**'
  ],
  coverageDirectory: "coverage",
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
};

