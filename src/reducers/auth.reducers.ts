import { authConstants } from "../constants/auth.constants";

const initialState = {
  loading: false,
  isAuthenticated: false,
  message: null,
};

export function authReducer(state = initialState, action: any) {
  switch (action.type) {
    case authConstants.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case authConstants.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        message: action.payload.message,
      };
    case authConstants.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        message: action.payload.message,
      };
    case authConstants.REFRESH_TOKEN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case authConstants.REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
      };
    case authConstants.REFRESH_TOKEN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
      };
    case authConstants.LOGOUT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case authConstants.LOGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        message: null,
      };
    case authConstants.LOGOUT_FAILURE:
      return {
        ...state,
        loading: false,
        message: action.payload.message,
      };
    default:
      return state;
  }
}
