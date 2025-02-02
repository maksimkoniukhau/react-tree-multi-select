import {JestConfigWithTsJest} from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: "jsdom",
  transform: {
    "^.+.tsx?$": ["ts-jest", {tsconfig: './tsconfig.jest.json'}],
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.tsx'],
  testMatch: [
    "**/src/__tests__/**/?(*.)test.ts?(x)"
  ],
  moduleNameMapper: {
    '\\.scss$': 'identity-obj-proxy',
  },
};

export default config;