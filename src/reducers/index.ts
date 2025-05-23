import { combineReducers } from "redux";
import { authReducer } from "./auth.reducers";

export interface RootState {
  auth: ReturnType<typeof authReducer>;
}

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;
