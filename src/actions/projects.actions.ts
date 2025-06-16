import { projectConstants } from "../constants/projects.contants";
import {
  getAllProjectsService,
  createNewProjectService,
  getProjectDetailsService,
  editProjectDetailsService,
  deleteProjectService,
  executeProjectCodeService,
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

export const getProjectDetailsAction =
  (projectId: string) => async (dispatch: any) => {
    dispatch({ type: projectConstants.GET_PROJECT_DETAILS_REQUEST });
    try {
      const project = await getProjectDetailsService(projectId);
      dispatch({
        type: projectConstants.GET_PROJECT_DETAILS_SUCCESS,
        payload: project.project,
      });
    } catch (error: any) {
      dispatch({
        type: projectConstants.GET_PROJECT_DETAILS_FAILURE,
        payload: { message: error.toString() },
      });
    }
  };

export const editProjectDetailsAction =
  (projectId: string, projectData: any) => async (dispatch: any) => {
    dispatch({ type: projectConstants.EDIT_PROJECT_REQUEST });
    try {
      const newProject = await editProjectDetailsService(
        projectId,
        projectData
      );
      dispatch({
        type: projectConstants.EDIT_PROJECT_SUCCESS,
        payload: newProject.project,
      });
    } catch (error: any) {
      dispatch({
        type: projectConstants.EDIT_PROJECT_FAILURE,
        payload: { message: error.toString() },
      });
    }
  };

export const deleteProjectAction =
  (projectId: string) => async (dispatch: any) => {
    dispatch({ type: projectConstants.DELETE_PROJECT_REQUEST });
    try {
      const response = await deleteProjectService(projectId);
      dispatch({
        type: projectConstants.DELETE_PROJECT_SUCCESS,
        payload: response,
      });
    } catch (error: any) {
      dispatch({
        type: projectConstants.DELETE_PROJECT_FAILURE,
        payload: { message: error.toString() },
      });
    }
  };

export const executeProjectCodeAction =
  (projectId: string, codeValue: string) => async (dispatch: any) => {
    dispatch({ type: projectConstants.EXECUTE_CODE_REQUEST });
    try {
      const output = await executeProjectCodeService(projectId, codeValue);
      dispatch({
        type: projectConstants.EXECUTE_CODE_SUCCESS,
        payload: {
          executionResult: output.executionResult,
          message: output.message,
        },
      });
    } catch (error: any) {
      dispatch({
        type: projectConstants.EXECUTE_CODE_FAILURE,
        payload: { message: error.toString() },
      });
    }
  };
