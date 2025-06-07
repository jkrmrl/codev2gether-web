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

export const createNewProjectService = async (
  projectData: any
): Promise<any> => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
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

export const getProjectDetailsService = async (
  projectId: string
): Promise<any> => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
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

export const editProjectDetailsService = async (
  projectId: string,
  projectData: any
): Promise<any> => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
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
