import { z } from 'zod';

// Generic Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// API Response Types
export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
};

// Error Types
export interface AppError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Authentication Types
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresAt: Date;
}

// Form Types
export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox';
  required?: boolean;
  options?: string[];
  defaultValue?: any;
};

// Route Types
export type RouteConfig = {
  path: string;
  name: string;
  component: React.ComponentType<any>;
  layout?: React.ComponentType<any>;
  authRequired?: boolean;
  roles?: string[];
};

// Theme Types
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    error: string;
    success: string;
    warning: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  spacing: Record<string, number>;
}

// Validation Types
export type ValidationSchema<T> = z.ZodSchema<T>;

// Storage Types
export interface StorageItem {
  key: string;
  value: any;
  expiresAt?: Date;
}

// Event Types
export interface AppEvent {
  type: string;
  payload?: any;
  timestamp: Date;
}
