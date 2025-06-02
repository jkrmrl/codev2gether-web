import { combineReducers } from "redux";
import { authReducer } from "./auth.reducers";
import { projectReducer } from "./projects.reducers";

const rootReducer = combineReducers({
  auth: authReducer,
  projects: projectReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
