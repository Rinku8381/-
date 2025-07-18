import { z } from 'zod';

// Type Guards
export const isClient = typeof window !== 'undefined';

// Date Helpers
export const formatDate = (date: Date, format: string = 'yyyy-MM-dd') => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const d = new Date(date);
  
  return format
    .replace('yyyy', d.getFullYear().toString())
    .replace('MM', pad(d.getMonth() + 1))
    .replace('dd', pad(d.getDate()))
    .replace('HH', pad(d.getHours()))
    .replace('mm', pad(d.getMinutes()))
    .replace('ss', pad(d.getSeconds()));
};

// Object Helpers
export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
};

// Array Helpers
export const chunk = <T>(array: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
};

// String Helpers
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// URL Helpers
export const getBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
};

// Validation Helper
export const validateSchema = <T>(
  schema: z.Schema<T>,
  data: unknown
): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.issues));
  }
  return result.data;
};

// Storage Helpers
export const setLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
};

export const getLocalStorage = <T>(key: string): T | null => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error getting localStorage:', error);
    return null;
  }
};

// Error Handling
export const handleError = (error: Error | unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
