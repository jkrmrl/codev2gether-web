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

function Projects() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const dispatch = useDispatch<AppDispatch>();
  const projects = useSelector(selectAllProjects);
  const loading = useSelector(selectProjectsLoading);
  const message = useSelector(selectProjectsMessage);
  const currentUserName = useSelector(selectCurrentUserName);
  const currentUserId = useSelector(selectCurrentUserId);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
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
        <button className="text-xs py-2 px-2 font-semibold text-white rounded bg-blue-500 hover:bg-blue-700 cursor-pointer">
          Create New Project
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filteredProjects.map((project: any) => (
          <div
            key={project.id}
            className="bg-white rounded-md shadow-md p-6 cursor-pointer"
          >
            <h2 className="mb-4 text-sm font-semibold text-gray-700">
              {project.name}
            </h2>
            <p className="text-xs text-gray-600">{project.description}</p>
          </div>
        ))}
        {filteredProjects.length === 0 && (
          <p className="text-gray-500 col-span-full">No projects found</p>
        )}
      </div>
    </div>
  );
}

export default Projects;
