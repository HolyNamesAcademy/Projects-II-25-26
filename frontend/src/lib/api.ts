// API utility functions for communicating with Spring Boot backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const API_BASE_PATH = process.env.NEXT_PUBLIC_API_BASE || "/api";

export const API_URL = `${API_BASE_URL}${API_BASE_PATH}`;
//Token management utilities
//constant token key for local storage
const TOKEN_KEY = "authToken";

//function to fetch Token from local storage
function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
//function to store token in local storage
function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}
//function to remove token from local storage
function removeAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

//Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Important for CORS with credentials
  };

  //add authorization header if token exists
  const token = getAuthToken();
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    throw new Error(
      `API call failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
interface AuthResponse {
  token: string;
  name: string;
  email: string;
}
interface LoginRequest {
  email: string;
  password: string;
}
interface CreateItemRequest {
  name: string;
  price: number;
  size: string;
  type: string;
  color: string;
  favorite?: boolean;
  image: string;
  description: string;
}

export interface Item {
  id: number;
  name: string;
  price: number;
  size: string;
  type: string;
  color: string;
  favorite?: boolean;
  image: string;
  description: string;
}

// API functions for your Spring Boot endpoints
export const api = {
  auth: {
    me: async (): Promise<AuthResponse> => {
      try {
        if (!getAuthToken()) {
          throw new Error("No authentication token found");
        }
        return apiCall<AuthResponse>("/auth/me");
      } catch (error) {
        removeAuthToken();
        throw error;
      }
    },

    register: async (request: RegisterRequest): Promise<AuthResponse> => {
      const response = await apiCall<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(request),
      });

      if (response.token) {
        setAuthToken(response.token);
      }

      return response;
    },

    login: async (request: LoginRequest): Promise<AuthResponse> => {
      const response = await apiCall<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(request),
      });

      if (response.token) {
        setAuthToken(response.token);
      }

      return response;
    },

    logout: async (): Promise<void> => {
      removeAuthToken();
    },
  },

  items: {
    create: async (request: Item): Promise<Item> => {
      return apiCall<Item>("/items", {
        method: "POST",
        body: JSON.stringify(request),
      });
    },
    favorites: {
      fetch: async (): Promise<Item[]> => {
        return apiCall<Item[]>("/items/favorites");
      },
      add: async (itemId: number): Promise<void> => {
        return apiCall<void>(`/items/${itemId}/favorite`, {
          method: "POST",
        });
      },
      remove: async (itemId: number): Promise<void> => {
        return apiCall<void>(`/items/${itemId}/favorite`, {
          method: "DELETE",
        });
      },
    },
  },
};

// Error handling utility
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}
