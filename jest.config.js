/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/src/services/"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/src/services.test.ts"],
};
