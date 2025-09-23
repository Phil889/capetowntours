// Jest setup for tour reviews testing
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Next.js modules that are not available in test environment
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

jest.mock('next/headers', () => ({
  headers: () => new Map(),
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
  }),
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key) => key,
  useLocale: () => 'en',
  useMessages: () => ({}),
}));

jest.mock('next-intl/server', () => ({
  getTranslations: () => (key) => Promise.resolve(key),
  getLocale: () => Promise.resolve('en'),
  getMessages: () => Promise.resolve({}),
}));

// Mock Supabase client
jest.mock('@/lib/supabase-server', () => ({
  getSupabaseClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn(() => ({
                data: [],
                error: null
              }))
            }))
          }))
        }))
      }))
    }))
  }))
}));

// Mock performance API
global.performance = global.performance || {
  now: () => Date.now(),
  mark: jest.fn(),
  measure: jest.fn(),
};

// Mock console methods for cleaner test output
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' && 
      (args[0].includes('Warning') || args[0].includes('ReactDOMTestUtils'))
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' && 
      args[0].includes('componentWillReceiveProps')
    ) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test utilities
global.testUtils = {
  createMockReview: (overrides = {}) => ({
    id: 'test-' + Math.random().toString(36).substr(2, 9),
    name: 'Test Reviewer',
    location: 'Test City, Test Country',
    flag: '🇺🇸',
    date: '1 week ago',
    rating: 5,
    text: 'This is a test review with sufficient content to pass validation checks.',
    ...overrides
  }),
  
  createMockTour: (overrides = {}) => ({
    id: 'test-tour-' + Math.random().toString(36).substr(2, 9),
    slug: 'test-tour-slug',
    title: 'Test Tour',
    description: 'A test tour description',
    price: 1000,
    currency: 'ZAR',
    category: 'Safari',
    duration_days: 1,
    image_url: '/test-image.jpg',
    ...overrides
  }),
  
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  mockSupabaseResponse: (data = [], error = null) => ({
    data,
    error
  })
};

// Set up test environment variables
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// Increase timeout for comprehensive tests
jest.setTimeout(120000); // 2 minutes