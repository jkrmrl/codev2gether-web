import { projectConstants } from "../constants/projects.contants";
import {
  getAllProjectsService,
  createNewProjectService,
} from "../services/projects.services";

export const getAllProjectsAction = () => async (dispatch: any) => {
  dispatch({ type: projectConstants.GET_PROJECTS_REQUEST });
  try {
    const projects = await getAllProjectsService();
    dispatch({
      type: projectConstants.GET_PROJECTS_SUCCESS,
      payload: projects.projects,
    });
  } catch (error: any) {
    dispatch({
      type: projectConstants.GET_PROJECTS_FAILURE,
      payload: { message: error.toString() },
    });
  }
};

export const createNewProjectAction =
  (projectData: any) => async (dispatch: any) => {
    dispatch({ type: projectConstants.CREATE_PROJECT_REQUEST });
    try {
      const newProject = await createNewProjectService(projectData);
      dispatch({
        type: projectConstants.CREATE_PROJECT_SUCCESS,
        payload: newProject.project,
      });
    } catch (error: any) {
      dispatch({
        type: projectConstants.CREATE_PROJECT_FAILURE,
        payload: { message: error.toString() },
      });
    }
  };
