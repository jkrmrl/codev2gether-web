import { useState } from "react";

function Projects() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const currentUserName = "John Doe";
  const currentUserId = 1;

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const ALL_PROJECTS = [
    {
      id: 1,
      name: "Project Alpha",
      description: "Owned by you.",
      ownerId: 1,
      collaborators: [],
    },
    {
      id: 2,
      name: "Project Beta",
      description: "Shared with you.",
      ownerId: 2,
      collaborators: [1],
    },
    {
      id: 3,
      name: "Project Gamma",
      description: "Owned by someone else.",
      ownerId: 3,
      collaborators: [],
    },
    {
      id: 4,
      name: "Project Delta",
      description: "Owned by you, with collaborators.",
      ownerId: 1,
      collaborators: [2, 3],
    },
    {
      id: 5,
      name: "Project Epsilon",
      description: "Shared with you and others.",
      ownerId: 4,
      collaborators: [1, 5],
    },
    {
      id: 6,
      name: "Project Zeta",
      description: "Owned by someone else.",
      ownerId: 5,
      collaborators: [],
    },
  ];

  const filteredProjects = ALL_PROJECTS.filter((project) => {
    if (activeTab === "owned") {
      return project.ownerId === currentUserId;
    }
    if (activeTab === "collaborating") {
      return project.collaborators.includes(currentUserId);
    }
    return true;
  });

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
        </ul>
        <button className="text-xs py-2 px-2 font-semibold text-white rounded bg-blue-500 hover:bg-blue-700 cursor-pointer">
          Create New Project
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
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
