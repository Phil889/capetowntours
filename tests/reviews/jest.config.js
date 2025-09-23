const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: '../..',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Test environment
  testEnvironment: 'jsdom',
  
  // Test timeout for comprehensive tests
  testTimeout: 120000, // 2 minutes
  
  // Module name mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/../../$1',
  },
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    '../../lib/tour-reviews*.ts',
    '../../components/tours/**/*.tsx',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // Test patterns
  testMatch: [
    '**/*.test.ts',
    '**/*.test.tsx',
  ],
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Test reporters
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './reports',
      outputName: 'test-results.xml',
    }],
    ['jest-html-reporters', {
      publicPath: './reports',
      filename: 'test-report.html',
      expand: true,
    }],
  ],
  
  // Verbose output for debugging
  verbose: true,
  
  // Detect open handles
  detectOpenHandles: true,
  forceExit: true,
  
  // Global setup and teardown
  globalSetup: '<rootDir>/global-setup.js',
  globalTeardown: '<rootDir>/global-teardown.js',
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);