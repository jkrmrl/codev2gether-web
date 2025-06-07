import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import {
  getProjectDetailsAction,
  editProjectDetailsAction,
} from "../actions/projects.actions";
import {
  selectProjectDetails,
  selectProjectsLoading,
} from "../selectors/projects.selectors";

const programmingLanguages = ["Python", "Java", "Javascript", "C#", "C++", "R"];

function EditProjectModal({
  onClose,
  projectId,
}: {
  onClose: () => void;
  projectId: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectProjectsLoading);
  const projectDetails = useSelector(selectProjectDetails);
  const projectNameRef = useRef<HTMLInputElement>(null);
  const projectDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const programmingLanguageRef = useRef<HTMLSelectElement>(null);
  const collaboratorInputRef = useRef<HTMLInputElement>(null);

  const [collaborators, setCollaborators] = useState<
    {
      username: string;
      role: "viewer" | "editor";
      action: "add" | "edit" | "remove";
    }[]
  >([]);

  useEffect(() => {
    if (projectId && (!projectDetails || projectDetails.id !== projectId)) {
      dispatch(getProjectDetailsAction(projectId));
    }
  }, [dispatch, projectId, projectDetails]);

  useEffect(() => {
    if (projectDetails) {
      if (
        projectNameRef.current &&
        projectDescriptionRef.current &&
        programmingLanguageRef.current
      ) {
        projectNameRef.current.value = projectDetails.name;
        projectDescriptionRef.current.value = projectDetails.description;
        programmingLanguageRef.current.value =
          projectDetails.programming_language;
      }
      if (Array.isArray(projectDetails.collaborators)) {
        setCollaborators(
          projectDetails.collaborators.map((col: any) => ({
            username: col.user?.username,
            role: col.access_level,
          }))
        );
      }
    }
  }, [projectDetails]);

  const handleAddCollaborator = () => {
    const collaboratorUsername = collaboratorInputRef.current?.value.trim();
    if (!collaboratorUsername) return;

    if (collaborators.some((col) => col.username === collaboratorUsername)) {
      if (collaboratorInputRef.current) collaboratorInputRef.current.value = "";
      return;
    }

    setCollaborators([
      ...collaborators,
      { username: collaboratorUsername, role: "viewer", action: "add" },
    ]);

    if (collaboratorInputRef.current) collaboratorInputRef.current.value = "";
  };

  const handleRemoveCollaborator = (usernameToRemove: string) => {
    setCollaborators((prev) =>
      prev.map((col) =>
        col.username === usernameToRemove ? { ...col, action: "remove" } : col
      )
    );
  };

  const handleCollaboratorRoleChange = (
    usernameToUpdate: string,
    newRole: "viewer" | "editor"
  ) => {
    setCollaborators((prev) =>
      prev.map((col) => {
        if (col.username === usernameToUpdate) {
          return {
            ...col,
            role: newRole,
            action: col.action === "add" ? "add" : "edit",
          };
        }
        return col;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = projectNameRef.current?.value || "";
    const description = projectDescriptionRef.current?.value || "";
    const programming_language = programmingLanguageRef.current?.value || "";
    const projectData = {
      name,
      description,
      programming_language,
      collaborators: collaborators.map((col) => ({
        username: col.username,
        access_level: col.role,
        action: col.action,
      })),
    };

    await dispatch(editProjectDetailsAction(projectId, projectData));
    dispatch(getProjectDetailsAction(projectId));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg mx-auto">
        <h2 className="mb-6 text-2xl uppercase text-center font-bold text-blue-500">
          Edit Project Details
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
            <div className="mb-4">
              <label
                htmlFor="projectName"
                className="block text-gray-400 text-sm mb-2"
              >
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                ref={projectNameRef}
                className="shadow appearance-none border rounded w-full py-2 px-2 text-sm text-gray-700 border-gray-400"
                placeholder="Enter project name"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="projectDescription"
                className="block text-gray-400 text-sm mb-2"
              >
                Description
              </label>
              <textarea
                id="projectDescription"
                ref={projectDescriptionRef}
                rows={4}
                className="shadow appearance-none border rounded w-full py-2 px-2 text-sm text-gray-700 border-gray-400"
                placeholder="Enter project description"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label
                htmlFor="programmingLanguage"
                className="block text-gray-400 text-sm mb-2"
              >
                Programming Language
              </label>
              <select
                id="programmingLanguage"
                ref={programmingLanguageRef}
                className="shadow appearance-none border rounded w-full py-2 px-2 text-sm text-gray-700 border-gray-400"
                required
              >
                <option value="">Select a language</option>
                {programmingLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="collaborators"
                className="block text-gray-400 text-sm mb-2"
              >
                Collaborators
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  id="collaborators"
                  ref={collaboratorInputRef}
                  className="shadow appearance-none border rounded w-full py-2 px-2 text-sm text-gray-700 border-gray-400"
                  placeholder="Enter collaborator username"
                />
                <button
                  type="button"
                  onClick={handleAddCollaborator}
                  className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 px-2 rounded-r cursor-pointer"
                >
                  Add
                </button>
              </div>
              {collaborators.filter((col) => col.action !== "remove").length >
                0 && (
                <div className="mt-4 border border-gray-200 rounded p-3 max-h-40 overflow-y-auto">
                  {collaborators
                    .filter((col) => col.action !== "remove")
                    .map((col) => (
                      <div
                        key={col.username}
                        className="flex items-center justify-between mb-2 p-2 rounded"
                      >
                        <span className="text-gray-800 text-sm font-medium">
                          {col.username}
                        </span>
                        <div className="flex items-center">
                          <select
                            className="ml-2 border rounded py-1 px-2 text-xs text-gray-700"
                            value={col.role}
                            onChange={(e) =>
                              handleCollaboratorRoleChange(
                                col.username,
                                e.target.value as "viewer" | "editor"
                              )
                            }
                          >
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                          </select>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveCollaborator(col.username)
                            }
                            className="ml-2 text-red-500 hover:text-red-700 py-1 px-2 border rounded text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="hover:bg-gray-100 mr-2 text-blue-500 text-sm py-2 px-2 rounded border cursor-pointer"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 px-2 rounded cursor-pointer"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProjectModal;
