import { NextResponse } from 'next/server';
import { z } from 'zod';

// API Error Types
export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// API Response Types
export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
};

// API Request Validation
export const validateRequest = <T>(schema: z.Schema<T>) => {
  return (req: Request): Promise<T> => {
    return req.json().then((data) => {
      const result = schema.safeParse(data);
      if (!result.success) {
        throw new ApiError(400, JSON.stringify(result.error.issues));
      }
      return result.data;
    });
  };
};

// API Response Handler
export const apiResponse = <T>(
  data: T | null,
  status: number = 200,
  error: string | null = null
): NextResponse => {
  return NextResponse.json({
    data,
    error,
    status,
  }, { status });
};

// API Error Handler
export const apiErrorHandler = (error: Error): NextResponse => {
  if (error instanceof ApiError) {
    return apiResponse(null, error.statusCode, error.message);
  }
  return apiResponse(null, 500, 'Internal Server Error');
};
