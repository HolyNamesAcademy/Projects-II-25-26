// API utility functions for communicating with Spring Boot backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_BASE_PATH = process.env.NEXT_PUBLIC_API_BASE || '/api';

export const API_URL = `${API_BASE_URL}${API_BASE_PATH}`;

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Important for CORS with credentials
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// API functions for your Spring Boot endpoints
export const api = {
  // Health check
  health: () => apiCall<{
    status: string;
    service: string;
    version: string;
    timestamp: string;
  }>('/health'),

  // Hello endpoint
  hello: () => apiCall<{
    message: string;
    timestamp: string;
    status: string;
  }>('/hello'),

  // Users endpoint
  users: () => apiCall<{
    users: Array<{
      id: number;
      name: string;
      email: string;
      role: string;
    }>;
    total: number;
    timestamp: string;
    status: string;
  }>('/users'),
};

// Error handling utility
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
