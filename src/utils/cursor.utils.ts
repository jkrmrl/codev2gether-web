import { WidgetType, Decoration, EditorView } from "@codemirror/view";
import { StateEffect, StateField } from "@codemirror/state";

const userColors = [
  "#FF0000",
  "#0000FF",
  "#008000",
  "#FFA500",
  "#800080",
  "#00FFFF",
];

const userCursorColors: { [key: string]: string } = {};
let colorIndex = 0;

export const getColorForUser = (username: string): string => {
  if (!userCursorColors[username]) {
    userCursorColors[username] = userColors[colorIndex % userColors.length];
    colorIndex++;
  }
  return userCursorColors[username];
};

export class CursorWidget extends WidgetType {
  username: string;
  color: string;

  constructor(username: string, color: string) {
    super();
    this.username = username;
    this.color = color;
  }

  toDOM() {
    const cursor = document.createElement("div");
    cursor.style.cssText = `
      position: relative;
      display: inline-block;
      border-left: 2px solid ${this.color};
      margin-left: -1px;
      height: 1.2em;
    `;

    const tooltip = document.createElement("div");
    tooltip.textContent = this.username;
    tooltip.style.cssText = `
      position: absolute;
      top: -1.5em;
      left: -0.5em;
      font-size: 0.8em;
      color: white;
      padding: 2px 4px;
      border-radius: 4px;
      white-space: nowrap;
      background-color: ${this.color};
    `;
    cursor.appendChild(tooltip);
    return cursor;
  }

  eq(other: WidgetType) {
    return other instanceof CursorWidget && other.username === this.username;
  }

  ignoreEvent() {
    return true;
  }
}

export const remoteCursorEffect = StateEffect.define<{
  username: string;
  cursorPosition: number;
}>();

export const remoteCursorRemovalEffect = StateEffect.define<string>();

export const remoteCursors = StateField.define({
  create() {
    return Decoration.none;
  },
  update(old, tr) {
    const remoteCursorUpdates = tr.effects.filter((e) =>
      e.is(remoteCursorEffect)
    );

    if (remoteCursorUpdates.length > 0) {
      const decorations = remoteCursorUpdates.map((effect) => {
        const { username, cursorPosition } = effect.value;
        const color = getColorForUser(username);
        return Decoration.widget({
          widget: new CursorWidget(username, color),
          side: -1,
        }).range(cursorPosition);
      });
      return Decoration.set(decorations);
    }

    const remoteCursorRemovals = tr.effects.filter((e) =>
      e.is(remoteCursorRemovalEffect)
    );

    if (remoteCursorRemovals.length > 0) {
      const usernameToRemove = remoteCursorRemovals[0].value;
      const newDecorations: import("@codemirror/state").Range<Decoration>[] =
        [];

      old.between(0, tr.state.doc.length, (from, to, value) => {
        const widget = (value as any).widget;
        if (
          !(
            widget instanceof CursorWidget &&
            widget.username === usernameToRemove
          )
        ) {
          newDecorations.push(value.range(from, to));
        }
      });

      return Decoration.set(newDecorations);
    }

    return old.map(tr.changes);
  },
  provide: (f) => EditorView.decorations.from(f),
});
