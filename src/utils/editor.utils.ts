import {
  HighlightStyle,
  syntaxHighlighting,
  bracketMatching,
} from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { keymap, lineNumbers } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import {
  defaultKeymap,
  historyKeymap,
  indentWithTab,
  history,
} from "@codemirror/commands";
import { autocompletion, closeBrackets } from "@codemirror/autocomplete";

export const myHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "blue", fontWeight: "bold" },
  { tag: tags.comment, color: "gray", fontStyle: "italic" },
  { tag: tags.string, color: "green" },
  { tag: tags.number, color: "orange" },
  { tag: tags.bool, color: "green" },
  { tag: tags.variableName, color: "purple" },
  { tag: tags.operator, color: "blue", fontWeight: "bold" },
  { tag: tags.punctuation, color: "gray" },
]);

export const getLanguageMode = (language: string): Extension => {
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

export const autoSemicolonOnEnter = (lang: string): Extension =>
  keymap.of([
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

export const commonExtensions = [
  lineNumbers(),
  history(),
  keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
  autocompletion(),
  syntaxHighlighting(myHighlightStyle),
  closeBrackets(),
  bracketMatching(),
];
