import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { refreshTokenAction } from "../actions/auth.actions";

export const useAuthCheck = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(refreshTokenAction());
  }, [dispatch]);
};
