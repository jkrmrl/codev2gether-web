import { jwtDecode } from "jwt-decode";

export const setAuthToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const clearAuthToken = () => {
  localStorage.removeItem("accessToken");
};

export const getRefreshToken = () => {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.startsWith("refreshToken=")) {
      return cookie.substring("refreshToken=".length);
    }
  }
  return null;
};

export const decodeAccessToken = (): any | null => {
  const token = getAuthToken();
  if (!token) {
    return null;
  }
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};
