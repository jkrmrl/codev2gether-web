import { projectConstants } from "../constants/projects.contants";

const projectState = {
  loading: false,
  projects: [],
  message: null,
};

export function projectReducer(state = projectState, action: any) {
  switch (action.type) {
    case projectConstants.GET_PROJECTS_REQUEST:
      return {
        ...state,
        loading: true,
        message: null,
      };
    case projectConstants.GET_PROJECTS_SUCCESS:
      return {
        ...state,
        loading: false,
        projects: action.payload,
        message: null,
      };
    case projectConstants.GET_PROJECTS_FAILURE:
      return {
        ...state,
        loading: false,
        projects: [],
        message: action.payload.message,
      };
    default:
      return state;
  }
}
