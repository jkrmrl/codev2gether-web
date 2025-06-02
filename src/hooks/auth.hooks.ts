import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { AppDispatch } from "../store";
import { refreshTokenAction } from "../actions/auth.actions";
import {
  selectAuthIsAuthenticated,
  selectAuthLoading,
} from "../selectors/auth.selectors";

export const useAuthCheck = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const isAuthenticated = useSelector(selectAuthIsAuthenticated);
  const loading = useSelector(selectAuthLoading);

  useEffect(() => {
    if (isAuthenticated || loading) return;

    const isPublicRoute =
      location.pathname === "/login" || location.pathname === "/register";

    if (!isPublicRoute) {
      dispatch(refreshTokenAction());
    }
  }, [dispatch, isAuthenticated, loading, location.pathname]);
};
