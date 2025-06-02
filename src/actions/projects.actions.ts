import { projectConstants } from "../constants/projects.contants";
import { getAllProjectsService } from "../services/projects.services";

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
