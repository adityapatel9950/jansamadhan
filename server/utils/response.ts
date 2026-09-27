import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const successResponse = <T>(res: Response, data: T, message?: string, statusCode = 200) => {
  const payload: ApiResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(payload);
};

export const errorResponse = (res: Response, error: string, statusCode = 400) => {
  const payload: ApiResponse = {
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(payload);
};

export const paginatedResponse = <T>(
  res: Response,
  result: PaginatedResult<T>,
  message?: string,
  statusCode = 200
) => {
  const payload: ApiResponse<PaginatedResult<T>> = {
    success: true,
    data: result,
    message,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(payload);
};
