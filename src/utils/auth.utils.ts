export const setAuthToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

export const getAuthToken = () => {
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
