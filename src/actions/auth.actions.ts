import { authConstants } from "../constants/auth.constants";
import {
  loginService,
  refreshTokenService,
  logoutService,
} from "../services/auth.services";
import { clearAuthToken } from "../utils/auth.utils";

export const loginAction =
  (username: string, password: string) => async (dispatch: any) => {
    dispatch({ type: authConstants.LOGIN_REQUEST });
    try {
      const data = await loginService(username, password);
      dispatch({
        type: authConstants.LOGIN_SUCCESS,
        payload: {
          message: data.message,
        },
      });
    } catch (error: any) {
      dispatch({
        type: authConstants.LOGIN_FAILURE,
        payload: { message: error.toString() },
      });
    }
  };

export const refreshTokenAction = () => async (dispatch: any) => {
  dispatch({ type: authConstants.REFRESH_TOKEN_REQUEST });
  try {
    const data = await refreshTokenService();
    dispatch({
      type: authConstants.REFRESH_TOKEN_SUCCESS,
      payload: { accessToken: data.accessToken },
    });
  } catch (error: any) {
    clearAuthToken();
    dispatch({
      type: authConstants.REFRESH_TOKEN_FAILURE,
      payload: { message: error.toString() },
    });
  }
};

export const logoutAction = () => async (dispatch: any) => {
  dispatch({ type: authConstants.LOGOUT_REQUEST });
  try {
    await logoutService();
    dispatch({ type: authConstants.LOGOUT_SUCCESS });
  } catch (error: any) {
    dispatch({
      type: authConstants.LOGOUT_FAILURE,
      payload: { message: error.toString() },
    });
  }
};
