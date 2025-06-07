import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { getAllProjectsAction } from "../actions/projects.actions";
import {
  selectCurrentUserId,
  selectCurrentUserName,
} from "../selectors/auth.selectors";
import {
  selectAllProjects,
  selectProjectsLoading,
  selectProjectsMessage,
} from "../selectors/projects.selectors";
import CreateProjectModal from "../components/CreateProjectModal";
import EditProjectModal from "../components/EditProjectModal";

function Projects() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showCreateProjectModal, setShowCreateProjectModal] =
    useState<boolean>(false);
  const [showEditProjectModal, setShowEditProjectModal] =
    useState<boolean>(false);
  const [openProjectMenuId, setOpenProjectMenuId] = useState<string | null>(
    null
  );
  const [projectIdToEdit, setProjectIdToEdit] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const projects = useSelector(selectAllProjects);
  const loading = useSelector(selectProjectsLoading);
  const message = useSelector(selectProjectsMessage);
  const currentUserName = useSelector(selectCurrentUserName);
  const currentUserId = useSelector(selectCurrentUserId);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCreateNewProjectClick = () => {
    setShowCreateProjectModal(true);
  };

  const handleCloseCreateProjectModal = () => {
    setShowCreateProjectModal(false);
  };

  const handleToggleProjectMenu = (projectId: string) => {
    setOpenProjectMenuId(openProjectMenuId === projectId ? null : projectId);
  };

  const handleEditProjectClick = (projectId: string) => {
    setProjectIdToEdit(projectId);
    setShowEditProjectModal(true);
    setOpenProjectMenuId(null);
  };

  const handleCloseEditProjectModal = () => {
    setShowEditProjectModal(false);
    setProjectIdToEdit(null);
    dispatch(getAllProjectsAction());
  };

  useEffect(() => {
    dispatch(getAllProjectsAction());
  }, [dispatch]);

  const filteredProjects = (projects || []).filter((project: any) => {
    if (!currentUserId) {
      if (activeTab === "owned" || activeTab === "collaborating") {
        return false;
      }
      return true;
    }
    if (activeTab === "owned") {
      return project.owner_id === currentUserId;
    }
    if (activeTab === "collaborating") {
      return project.owner_id !== currentUserId;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="mx-48 mt-36 mb-36 p-8 border rounded shadow-md border-gray-200">
        <h1 className="mb-4 text-2xl uppercase text-center font-bold text-blue-500">
          Hi, {currentUserName}!
        </h1>
        <div>Loading Projects...</div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="mx-48 mt-36 mb-36 p-8 border rounded shadow-md border-gray-200">
        <h1 className="mb-4 text-2xl uppercase text-center font-bold text-blue-500">
          Hi, {currentUserName}!
        </h1>
        <div>Error loading projects: {message}</div>
      </div>
    );
  }

  return (
    <div className="mx-48 mt-36 mb-36 p-8 border rounded shadow-md border-gray-200">
      <h1 className="mb-4 text-2xl uppercase text-center font-bold text-blue-500">
        Hi, {currentUserName}!
      </h1>
      <div className="mb-6 border-b border-gray-200 flex items-center justify-between">
        <ul className="flex -mb-px">
          <li className="mr-2">
            <button
              onClick={() => handleTabClick("all")}
              className={`text-sm inline-block p-4 rounded-t-lg hover:text-blue-300 cursor-pointer ${
                activeTab === "all"
                  ? "font-semibold border-b-2 border-blue-500 text-blue-500 hover:text-blue-500"
                  : "text-gray-400"
              }`}
            >
              All Projects
            </button>
          </li>
          {currentUserId && (
            <>
              <li className="mr-2">
                <button
                  onClick={() => handleTabClick("owned")}
                  className={`text-sm inline-block p-4 rounded-t-lg hover:text-blue-300 cursor-pointer ${
                    activeTab === "owned"
                      ? "font-semibold border-b-2 border-blue-500 text-blue-500 hover:text-blue-500"
                      : "text-gray-400"
                  }`}
                >
                  Authored by Me
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick("collaborating")}
                  className={`text-sm inline-block p-4 rounded-t-lg hover:text-blue-300 cursor-pointer ${
                    activeTab === "collaborating"
                      ? "font-semibold border-b-2 border-blue-500 text-blue-500 hover:text-blue-500"
                      : "text-gray-400"
                  }`}
                >
                  Shared With Me
                </button>
              </li>
            </>
          )}
        </ul>
        <button
          className="text-xs py-2 px-2 font-semibold text-white rounded bg-blue-500 hover:bg-blue-700 cursor-pointer"
          onClick={handleCreateNewProjectClick}
        >
          Create New Project
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {filteredProjects.map((project: any) => (
          <div
            key={project.id}
            className="relative bg-white rounded-md shadow-md p-6 cursor-pointer"
          >
            <div className="flex justify-between">
              <h2 className="mb-4 text-sm font-semibold text-gray-700">
                {project.name}
              </h2>
              <div className="relative">
                <button
                  onClick={() => handleToggleProjectMenu(project.id)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                {openProjectMenuId === project.id && (
                  <div className="absolute left-2 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-10">
                    <button className="block px-2 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left">
                      View Project
                    </button>
                    {currentUserId && project.owner_id === currentUserId && (
                      <>
                        <button
                          className="block px-2 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={() => handleEditProjectClick(project.id)}
                        >
                          Edit Project
                        </button>
                        <button className="block px-2 py-2 text-xs text-red-700 hover:bg-gray-100 w-full text-left">
                          Delete Project
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-600">{project.description}</p>
          </div>
        ))}
        {filteredProjects.length === 0 && (
          <p className="text-gray-500 col-span-full">No projects found</p>
        )}
      </div>
      {showCreateProjectModal && (
        <CreateProjectModal onClose={handleCloseCreateProjectModal} />
      )}
      {showEditProjectModal && projectIdToEdit && (
        <EditProjectModal
          onClose={handleCloseEditProjectModal}
          projectId={projectIdToEdit}
        />
      )}
    </div>
  );
}

export default Projects;
