import { projectConstants } from "../constants/projects.contants";
import * as services from "../services";

export const getAllProjectsAction = () => async (dispatch: any) => {
  dispatch({ type: projectConstants.GET_PROJECTS_REQUEST });
  try {
    const projects = await services.getAllProjectsService();
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
      const newProject = await services.createNewProjectService(projectData);
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
      const project = await services.getProjectDetailsService(projectId);
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
      const newProject = await services.editProjectDetailsService(
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
      const response = await services.deleteProjectService(projectId);
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
      const output = await services.executeProjectCodeService(
        projectId,
        codeValue
      );
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

export const saveProjectCodeAction =
  (projectId: string, codeValue: string) => async (dispatch: any) => {
    dispatch({ type: projectConstants.SAVE_CODE_REQUEST });
    try {
      const newCode = await services.saveProjectCodeService(
        projectId,
        codeValue
      );
      dispatch({
        type: projectConstants.SAVE_CODE_SUCCESS,
        payload: {
          savedCode: newCode.savedCode,
          message: newCode.message,
        },
      });
    } catch (error: any) {
      dispatch({
        type: projectConstants.SAVE_CODE_FAILURE,
        payload: { message: error.toString() },
      });
    }
  };
