import { RootState } from "../reducers";
import { decodeAccessToken } from "../utils/auth.utils";

export const selectAuthIsAuthenticated = (state: RootState): boolean | null =>
  state.auth.isAuthenticated;

export const selectAuthLoading = (state: RootState): boolean | null =>
  state.auth.loading;

export const selectAuthMessage = (state: RootState): string | null =>
  state.auth.message;

export const selectCurrentUserId = (): number | null => {
  const decodedUser = decodeAccessToken();
  return decodedUser?.id || null;
};

export const selectCurrentUserName = (): string | null => {
  const decodedUser = decodeAccessToken();
  return decodedUser?.name || null;
};
