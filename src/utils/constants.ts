export const APP = {
  NAME: 'Seraphine Hybrid',
  VERSION: '1.0.0',
  DESCRIPTION: 'Seraphine Hybrid V1',
};

export const ROUTES = {
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  ONBOARDING: '/onboarding',
  SPLASH: '/splash',
  TERMS: '/terms',
} as const;

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '',
  TIMEOUT: 30000,
  VERSION: 'v1',
} as const;

export const STORAGE = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user_data',
  THEME: 'theme_preference',
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export const ERROR_MESSAGES = {
  NETWORK: 'Network error occurred. Please try again later.',
  UNAUTHORIZED: 'Unauthorized access. Please login again.',
  NOT_FOUND: 'The requested resource was not found.',
  DEFAULT: 'An unexpected error occurred.',
} as const;

export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
} as const;
