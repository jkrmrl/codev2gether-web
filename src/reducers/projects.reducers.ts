import { projectConstants } from "../constants/projects.contants";

const projectState = {
  loading: false,
  projects: [],
  projectDetails: null,
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
    case projectConstants.CREATE_PROJECT_REQUEST:
      return {
        ...state,
        loading: true,
        message: null,
      };
    case projectConstants.CREATE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        projects: [...state.projects, action.payload],
        message: null,
      };
    case projectConstants.CREATE_PROJECT_FAILURE:
      return {
        ...state,
        loading: false,
        message: action.payload.message,
      };
    case projectConstants.GET_PROJECT_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        projectDetails: null,
        message: null,
      };
    case projectConstants.GET_PROJECT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        projectDetails: action.payload,
        message: null,
      };
    case projectConstants.GET_PROJECT_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        projectDetails: null,
        message: action.payload.message,
      };
    case projectConstants.EDIT_PROJECT_REQUEST:
      return {
        ...state,
        loading: true,
        message: null,
      };
    case projectConstants.EDIT_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        projectDetails: {
          ...action.payload,
          collaborators: action.payload.collaborators.map((col: any) => ({
            ...col,
            user: {
              id: col.user.id,
              name: col.user.name,
              username: col.user.username,
            },
          })),
        },
        message: null,
      };
    case projectConstants.EDIT_PROJECT_FAILURE:
      return {
        ...state,
        loading: false,
        message: action.payload.message,
      };
    case projectConstants.DELETE_PROJECT_REQUEST:
      return {
        ...state,
        loading: true,
        message: null,
      };
    case projectConstants.DELETE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload.message,
      };
    case projectConstants.DELETE_PROJECT_FAILURE:
      return {
        ...state,
        loading: false,
        message: action.payload.message,
      };
    default:
      return state;
  }
}
