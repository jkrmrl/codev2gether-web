import { RootState } from "../reducers";

export const selectAllProjects = (state: RootState): Array<any> | null =>
  state.projects.projects;

export const selectProjectsLoading = (state: RootState): any | null =>
  state.projects.loading;

export const selectProjectsMessage = (state: RootState): string | null =>
  state.projects.message;
