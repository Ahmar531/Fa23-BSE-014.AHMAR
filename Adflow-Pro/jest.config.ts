import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react' } }],
  },
  testPathPattern: '\\.(test|spec)\\.tsx?$',
  passWithNoTests: true,
  collectCoverageFrom: [
    'lib/**/*.ts',
    'app/api/**/*.ts',
    '!lib/supabase/**',
  ],
};

export default config;
