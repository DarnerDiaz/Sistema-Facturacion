module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'server.js',
    'config/**/*.js',
    'middleware/**/*.js',
    'models/**/*.js',
    'routes/**/*.js'
  ],
  setupFilesAfterEnv: []
};
