import { setAuthToken, clearAuthToken } from "../utils/auth.utils";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const loginService = async (
  username: string,
  password: string
): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw errorData.message;
    }
    const data = await response.json();
    setAuthToken(data.accessToken);
    return data;
  } catch (error: any) {
    throw error;
  }
};

export const refreshTokenService = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw errorData.message;
    }
    const data = await response.json();
    setAuthToken(data.accessToken);
    return data;
  } catch (error: any) {
    throw error;
  }
};

export const logoutService = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw errorData.message;
    }
    clearAuthToken();
  } catch (error: any) {
    clearAuthToken();
  }
};
