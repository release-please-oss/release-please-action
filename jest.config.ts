import type { Config } from 'jest';

export default {
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  displayName: 'release-please-action',
  moduleFileExtensions: ['ts', 'js', 'html'],
  reporters: ['default', ['jest-junit', { classNameTemplate: '{filepath}', outputDirectory: './build/junit' }]],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(tslib|@actions)/)'],
} satisfies Config;
