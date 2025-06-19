import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  executeProjectCodeAction,
  saveProjectCodeAction,
} from "../actions/projects.actions";
import {
  selectProjectDetails,
  selectProjectCodeOutput,
} from "../selectors/projects.selectors";
import { PlayIcon, SaveIcon, UsersIcon, HistoryIcon } from "lucide-react";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { EditorState, Extension } from "@codemirror/state";
import {
  defaultKeymap,
  historyKeymap,
  indentWithTab,
  history,
} from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { autocompletion, closeBrackets } from "@codemirror/autocomplete";
import { tags } from "@lezer/highlight";
import {
  HighlightStyle,
  syntaxHighlighting,
  bracketMatching,
} from "@codemirror/language";
import { AppDispatch } from "../store";
import { useNavigate } from "react-router-dom";
import ViewCollaboratorsModal from "../components/ViewCollaboratorsModal";

const myHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "blue", fontWeight: "bold" },
  { tag: tags.comment, color: "gray", fontStyle: "italic" },
  { tag: tags.string, color: "green" },
  { tag: tags.number, color: "orange" },
  { tag: tags.bool, color: "green" },
  { tag: tags.variableName, color: "purple" },
  { tag: tags.operator, color: "blue", fontWeight: "bold" },
  { tag: tags.punctuation, color: "gray" },
]);

const CodeEditor = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const projectDetails = useSelector(selectProjectDetails);
  const output = useSelector(selectProjectCodeOutput) as any;
  const codeRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorView | null>(null);
  const [showCollaborators, setShowCollaborators] = useState(false);

  const getLanguageMode = (language: string) => {
    switch (language.toLowerCase()) {
      case "javascript":
        return javascript();
      case "python":
        return python();
      case "java":
        return java();
      case "c++":
        return cpp();
      default:
        return javascript();
    }
  };

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

      const autoSemicolonOnEnter: Extension = keymap.of([
        {
          key: "Enter",
          run(view) {
            const { state } = view;
            const { from } = state.selection.main;
            const line = state.doc.lineAt(from);
            const lineText = line.text;
            const trimmedLine = lineText.trim();

            const insertPos = line.from + lineText.length;

            if (lang === "python") {
              const needsIndent = /:\s*$/.test(trimmedLine);
              const insertText = needsIndent ? "\n  " : "\n";
              view.dispatch({
                changes: { from: insertPos, insert: insertText },
                selection: { anchor: insertPos + insertText.length },
                scrollIntoView: true,
              });
              return true;
            }

            const shouldAddSemicolon =
              trimmedLine &&
              !trimmedLine.endsWith(";") &&
              !trimmedLine.endsWith("{") &&
              !trimmedLine.endsWith("}") &&
              !trimmedLine.endsWith(":") &&
              !trimmedLine.startsWith("//") &&
              !trimmedLine.includes("function");

            const needsIndent = /[{]\s*$/.test(trimmedLine);
            const insertText =
              (shouldAddSemicolon ? ";" : "") + (needsIndent ? "\n  " : "\n");

            view.dispatch({
              changes: { from: insertPos, insert: insertText },
              selection: { anchor: insertPos + insertText.length },
              scrollIntoView: true,
            });
            return true;
          },
        },
      ]);

      editorRef.current = new EditorView({
        state: EditorState.create({
          doc: mostRecentCode?.code_value || "",
          extensions: [
            autoSemicolonOnEnter,
            history(),
            keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
            getLanguageMode(lang),
            lineNumbers(),
            autocompletion(),
            syntaxHighlighting(myHighlightStyle),
            closeBrackets(),
            bracketMatching(),
          ],
        }),
        parent: codeRef.current,
      });
    }

    console.log(projectDetails);

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [projectDetails]);

  const handleRunCode = () => {
    if (editorRef.current && projectDetails?.id) {
      const code = editorRef.current.state.doc.toString();
      dispatch(executeProjectCodeAction(projectDetails.id, code));
    }
  };

  const handleSaveCode = () => {
    if (editorRef.current && projectDetails?.id) {
      const code = editorRef.current.state.doc.toString();
      dispatch(saveProjectCodeAction(projectDetails.id, code));
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
            <div className="flex justify-end px-4 py-2 border-b border-gray-200 space-x-2">
              <button
                onClick={handleSaveCode}
                className="flex items-center text-sm text-blue-500 border border-blue-500 px-3 py-1 rounded hover:bg-blue-50 cursor-pointer"
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
