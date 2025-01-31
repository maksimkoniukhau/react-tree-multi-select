/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: "jsdom",
  transform: {
    "^.+.tsx?$": ["ts-jest", {tsconfig: './tsconfig.jest.json'}],
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  testMatch: ['<rootDir>/src/__tests__/**/*'],
  moduleNameMapper: {
    '\\.scss$': 'identity-obj-proxy',
  },
};
