import { getAuthToken } from "../utils/auth.utils";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getAllProjectsService = async (): Promise<any> => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw errorData.message;
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw error;
  }
};
