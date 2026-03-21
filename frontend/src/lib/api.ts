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
  /** Present when returned from the API after login/register/me */
  id?: number;
}
interface LoginRequest {
  email: string;
  password: string;
}

export enum ItemSize {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
}

export enum ItemType {
  TOPS = "TOPS",
  BOTTOMS = "BOTTOMS",
  DRESSES = "DRESSES",
  SHOES = "SHOES",
}

export enum ItemColor {
  WHITE = "WHITE",
  BLACK = "BLACK",
  RED = "RED",
  BLUE = "BLUE",
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  PINK = "PINK",
  PURPLE = "PURPLE",
  ORANGE = "ORANGE",
  GRAY = "GRAY",
  BROWN = "BROWN",
}

/** All `ItemSize` values in order — use for selects, filters, etc. */
export const ITEM_SIZES = [
  ItemSize.XS,
  ItemSize.S,
  ItemSize.M,
  ItemSize.L,
  ItemSize.XL,
  ItemSize.XXL,
] as const;

/** All `ItemType` values in order */
export const ITEM_TYPES = [
  ItemType.TOPS,
  ItemType.BOTTOMS,
  ItemType.DRESSES,
  ItemType.SHOES,
] as const;

/** All `ItemColor` values in order */
export const ITEM_COLORS = [
  ItemColor.WHITE,
  ItemColor.BLACK,
  ItemColor.RED,
  ItemColor.BLUE,
  ItemColor.GREEN,
  ItemColor.YELLOW,
  ItemColor.PINK,
  ItemColor.PURPLE,
  ItemColor.ORANGE,
  ItemColor.GRAY,
  ItemColor.BROWN,
] as const;

interface CreateItemRequest {
  name: string;
  price: number;
  size: ItemSize;
  type: ItemType;
  color: ItemColor;
  favorite?: boolean;
  image: string;
  description: string;
}

export interface Item {
  id: number;
  name: string;
  price: number;
  size: ItemSize;
  type: ItemType;
  color: ItemColor;
  favorite: boolean;
  image: string;
  description: string;
  userId?: number | null;
}

export interface ItemSearchParams {
  query?: string;
  size?: string;
  type?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
}

function buildSearchQuery(params: ItemSearchParams): string {
  const sp = new URLSearchParams();
  if (params.query) sp.set("query", params.query);
  if (params.size) sp.set("size", params.size);
  if (params.type) sp.set("type", params.type);
  if (params.color) sp.set("color", params.color);
  if (params.minPrice != null) sp.set("minPrice", String(params.minPrice));
  if (params.maxPrice != null) sp.set("maxPrice", String(params.maxPrice));
  const q = sp.toString();
  return q ? `?${q}` : "";
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
    list: async (): Promise<Item[]> => {
      return await apiCall<Item[]>("/items");
    },

    getById: async (id: number): Promise<Item> => {
      return await apiCall<Item>(`/items/${id}`);
    },

    search: async (params: ItemSearchParams): Promise<Item[]> => {
      return await apiCall<Item[]>(`/items/search${buildSearchQuery(params)}`);
    },

    create: async (request: CreateItemRequest): Promise<Item> => {
      return await apiCall<Item>("/items", {
        method: "POST",
        body: JSON.stringify(request),
      });
    },

    update: async (id: number, request: CreateItemRequest): Promise<Item> => {
      return await apiCall<Item>(`/items/${id}`, {
        method: "PUT",
        body: JSON.stringify(request),
      });
    },

    delete: async (id: number): Promise<void> => {
      await apiCall<void>(`/items/${id}`, {
        method: "DELETE",
      });
    },

    favorites: {
      fetch: async (): Promise<Item[]> => {
        return await apiCall<Item[]>("/items/favorites");
      },
      add: async (itemId: number): Promise<void> => {
        await apiCall<void>(`/items/${itemId}/favorite`, {
          method: "POST",
        });
      },
      remove: async (itemId: number): Promise<void> => {
        await apiCall<void>(`/items/${itemId}/favorite`, {
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
