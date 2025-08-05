import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PlayIcon, SaveIcon, UsersIcon, HistoryIcon } from "lucide-react";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { AppDispatch } from "../store";
import { useNavigate } from "react-router-dom";
import ViewCollaboratorsModal from "../components/ViewCollaboratorsModal";
import * as actions from "../actions";
import * as selectors from "../selectors";
import * as utils from "../utils";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const CodeEditor = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const projectDetails = useSelector(selectors.selectProjectDetails);
  const currentUserId = selectors.selectCurrentUserId();
  const currentUsername = selectors.selectCurrentUserName();
  const output = useSelector(selectors.selectProjectCodeOutput) as any;
  const codeRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorView | null>(null);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [activeUsers, setActiveUsers] = useState<
    Array<{ username: string; color: string }>
  >([]);
  const [userCount, setUserCount] = useState(0);
  const isRemoteChange = useRef(false);

  const isViewer = (() => {
    if (!projectDetails || currentUserId == null) return false;

    if (projectDetails.owner_id === currentUserId) return false;

    const currentCollaborator = projectDetails.collaborators.find(
      (c: { user_id: number }) => c.user_id === currentUserId
    );

    return currentCollaborator?.access_level === "viewer";
  })();

  useEffect(() => {
    if (codeRef.current && !editorRef.current) {
      const mostRecentCode = projectDetails?.codes?.reduce(
        (latest: { updatedAt: Date }, current: { updatedAt: Date }) => {
          return new Date(current.updatedAt) > new Date(latest.updatedAt)
            ? current
            : latest;
        },
        projectDetails?.codes[0]
      );

      const lang =
        projectDetails?.programming_language?.toLowerCase() || "javascript";

      editorRef.current = new EditorView({
        state: EditorState.create({
          doc: mostRecentCode?.code_value || "",
          extensions: [
            ...utils.commonExtensions,
            utils.getLanguageMode(lang),
            utils.autoSemicolonOnEnter(lang),
            EditorView.editable.of(!isViewer),
            utils.remoteCursors,
            EditorView.updateListener.of((update) => {
              if (
                !isRemoteChange.current &&
                update.docChanged &&
                !isViewer &&
                projectDetails &&
                currentUsername
              ) {
                const newContent = update.state.doc.toString();
                socket.emit("text-change", {
                  projectId: projectDetails.id,
                  username: currentUsername,
                  content: newContent,
                });
              }
              if (
                update.selectionSet &&
                !isViewer &&
                projectDetails &&
                currentUsername
              ) {
                const newCursorPosition = update.state.selection.main.head;
                socket.emit("cursor-update", {
                  projectId: projectDetails.id,
                  username: currentUsername,
                  cursorPosition: newCursorPosition,
                });
              }
            }),
          ],
        }),

        parent: codeRef.current,
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [projectDetails, currentUserId, currentUsername, isViewer]);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    if (projectDetails && currentUsername) {
      socket.emit("join", {
        username: currentUsername,
        projectId: projectDetails.id,
      });
    }

    socket.on("user-joined", (data: { users: Array<{ username: string }> }) => {
      const usersWithColors = data.users.map((user) => ({
        ...user,
        color: utils.getColorForUser(user.username),
      }));
      setActiveUsers(usersWithColors);
      setUserCount(usersWithColors.length);
    });

    socket.on(
      "user-left",
      (data: { users: Array<{ username: string }>; username: string }) => {
        const usersWithColors = data.users.map((user) => ({
          ...user,
          color: utils.getColorForUser(user.username),
        }));
        setActiveUsers(usersWithColors);
        setUserCount(usersWithColors.length);
        if (editorRef.current) {
          editorRef.current.dispatch({
            effects: utils.remoteCursorRemovalEffect.of(data.username),
          });
        }
      }
    );

    socket.on(
      "text-change",
      (data: { projectId: string; username: string; content: string }) => {
        if (editorRef.current && data.username !== currentUsername) {
          const editorState = editorRef.current.state;
          const currentContent = editorState.doc.toString();
          if (currentContent !== data.content) {
            isRemoteChange.current = true;
            editorRef.current.dispatch({
              changes: {
                from: 0,
                to: editorState.doc.length,
                insert: data.content,
              },
            });
            isRemoteChange.current = false;
          }
        }
      }
    );

    socket.on(
      "cursor-update",
      (data: { username: string; cursorPosition: number }) => {
        if (data.username !== currentUsername && editorRef.current) {
          editorRef.current.dispatch({
            effects: utils.remoteCursorEffect.of(data),
          });
        }
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [projectDetails, currentUsername]);

  const handleRunCode = () => {
    if (editorRef.current && projectDetails?.id) {
      const code = editorRef.current.state.doc.toString();
      dispatch(actions.executeProjectCodeAction(projectDetails.id, code));
    }
  };

  const handleSaveCode = () => {
    if (editorRef.current && projectDetails?.id) {
      const code = editorRef.current.state.doc.toString();
      dispatch(actions.saveProjectCodeAction(projectDetails.id, code));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <div className="w-14 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
        <button
          className="text-gray-400 hover:text-blue-500 cursor-pointer"
          onClick={() => navigate(`/editor-history/${projectDetails.id}`)}
          title="View History"
        >
          <HistoryIcon size={20} />
        </button>
        <span className="text-gray-500 text-sm">
          {userCount} user{userCount !== 1 ? "s" : ""} online
        </span>
        <button
          className="text-gray-400 hover:text-blue-500 cursor-pointer"
          onClick={() => setShowCollaborators(true)}
          title="View Collaborators"
        >
          <UsersIcon size={20} />
        </button>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
          <div className="text-blue-500 font-semibold text-lg">
            {projectDetails.name}
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col border-r border-gray-200 bg-white">
            <div className="w-xl border-l border-gray-200 bg-white p-4 overflow-auto">
              <div className="text-sm text-gray-500 mb-2 font-medium">
                Active Users
              </div>
              <ul className="text-sm text-gray-700">
                {activeUsers.map((user, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span
                      style={{ backgroundColor: user.color }}
                      className="w-2 h-2 rounded-full inline-block"
                    ></span>
                    <span>{user.username}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end px-4 py-2 border-b border-gray-200 space-x-2">
              <button
                onClick={handleSaveCode}
                disabled={isViewer}
                className={
                  "flex items-center text-sm text-blue-500 border border-blue-500 px-3 py-1 rounded hover:bg-blue-50 cursor-pointer"
                }
              >
                <SaveIcon size={16} className="mr-1" />
                Save
              </button>
              <button
                onClick={handleRunCode}
                className="flex items-center text-sm text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 cursor-pointer"
              >
                <PlayIcon size={16} className="mr-1" />
                Run
              </button>
            </div>
            <div
              ref={codeRef}
              className="flex-1 p-4 bg-gray-100 text-gray-700"
            ></div>
          </div>
          <div className="w-xl border-l border-gray-200 bg-white p-4 overflow-auto">
            <div className="text-sm text-gray-500 mb-2 font-medium">Output</div>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {output?.stdout || "No output yet."}
            </pre>
          </div>
        </div>
      </div>
      {showCollaborators && (
        <ViewCollaboratorsModal onClose={() => setShowCollaborators(false)} />
      )}
    </div>
  );
};

export default CodeEditor;
