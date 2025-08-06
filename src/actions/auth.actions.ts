import { authConstants } from "../constants/auth.constants";
import * as services from "../services";
import * as utils from "../utils";

export const loginAction =
  (username: string, password: string) => async (dispatch: any) => {
    dispatch({ type: authConstants.LOGIN_REQUEST });
    try {
      const data = await services.loginService(username, password);
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
    const data = await services.refreshTokenService();
    dispatch({
      type: authConstants.REFRESH_TOKEN_SUCCESS,
      payload: { accessToken: data.accessToken },
    });
  } catch (error: any) {
    utils.clearAuthToken();
    dispatch({
      type: authConstants.REFRESH_TOKEN_FAILURE,
      payload: { message: error.toString() },
    });
  }
};

export const logoutAction = () => async (dispatch: any) => {
  dispatch({ type: authConstants.LOGOUT_REQUEST });
  try {
    await services.logoutService();
    dispatch({ type: authConstants.LOGOUT_SUCCESS });
  } catch (error: any) {
    dispatch({
      type: authConstants.LOGOUT_FAILURE,
      payload: { message: error.toString() },
    });
  }
};
