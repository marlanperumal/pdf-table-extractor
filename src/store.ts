import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Selection {
  x: number | null;
  y: number | null;
  width: number | null;
  height: number | null;
}

export interface Position {
  x: number;
  y: number;
}

export interface Column {
  x: number;
  name: string;
  type: "string" | "number" | "date";
}

export type MouseMode = "select" | "move" | "resize" | "insertColumn";

type State = {
  file: File | null;
  currentPage: number;
  totalPages: number;
  scale: number;
  currentPosition: Position | null;
  currentSelection: Selection | null;
  mouseMode: MouseMode | null;
  columns: Column[];
};

type Action = {
  setFile: (file: File | null | ((file: File | null) => File | null)) => void;
  setCurrentPage: (page: number | ((page: number) => number)) => void;
  setTotalPages: (pages: number | ((pages: number) => number)) => void;
  increasePage: () => void;
  decreasePage: () => void;
  setScale: (scale: number | ((scale: number) => number)) => void;
  increaseScale: () => void;
  decreaseScale: () => void;
  setCurrentPosition: (
    position:
      | { x: number; y: number }
      | null
      | ((position: { x: number; y: number } | null) => {
          x: number;
          y: number;
        } | null)
  ) => void;
  setCurrentSelection: (
    selection:
      | Selection
      | null
      | ((selection: Selection | null) => Selection | null)
  ) => void;
  clearCurrentSelection: () => void;
  setMouseMode: (
    mode: MouseMode | null | ((mode: MouseMode | null) => MouseMode | null)
  ) => void;
  addColumn: (column: Column) => void;
  removeColumn: (index: number) => void;
  setColumn: (index: number, column: Column) => void;
};

export const useStore = create<State & Action>()(
  devtools((set) => ({
    file: null,
    currentPage: 1,
    totalPages: 1,
    scale: 1,
    currentPosition: null,
    currentSelection: null,
    mouseMode: "select",
    columns: new Array<Column>(),
    setFile: (nextFile) =>
      set(
        (state) => ({
          file:
            typeof nextFile === "function" ? nextFile(state.file) : nextFile,
        }),
        undefined,
        "setFile"
      ),
    setCurrentPage: (page) =>
      set(
        (state) => ({
          currentPage:
            typeof page === "function" ? page(state.currentPage) : page,
        }),
        undefined,
        "setCurrentPage"
      ),
    increasePage: () =>
      set(
        (state) => ({
          currentPage: Math.min(state.currentPage + 1, state.totalPages),
          currentSelection: null,
        }),
        undefined,
        "increasePage"
      ),
    decreasePage: () =>
      set(
        (state) => ({
          currentPage: Math.max(state.currentPage - 1, 1),
          currentSelection: null,
        }),
        undefined,
        "decreasePage"
      ),
    setTotalPages: (pages) =>
      set(
        (state) => ({
          totalPages:
            typeof pages === "function" ? pages(state.totalPages) : pages,
        }),
        undefined,
        "setTotalPages"
      ),
    increaseScale: () =>
      set(
        (state) => ({ scale: Math.min(state.scale + 0.1, 1.5) }),
        undefined,
        "increaseScale"
      ),
    decreaseScale: () =>
      set(
        (state) => ({ scale: Math.max(state.scale - 0.1, 0.5) }),
        undefined,
        "decreaseScale"
      ),
    setScale: (scale) =>
      set(
        (state) => ({
          scale: typeof scale === "function" ? scale(state.scale) : scale,
        }),
        undefined,
        "setScale"
      ),
    setCurrentPosition: (position) =>
      set(
        (state) => ({
          currentPosition:
            typeof position === "function"
              ? position(state.currentPosition)
              : position,
        }),
        undefined,
        "setCurrentPosition"
      ),
    setCurrentSelection: (selection) =>
      set(
        (state) => ({
          currentSelection:
            typeof selection === "function"
              ? selection(state.currentSelection)
              : selection,
        }),
        undefined,
        "setCurrentSelection"
      ),
    clearCurrentSelection: () =>
      set(
        () => ({
          currentSelection: null,
          mouseMode: "select",
        }),
        undefined,
        "clearCurrentSelection"
      ),
    setMouseMode: (mode) =>
      set(
        (state) => ({
          mouseMode: typeof mode === "function" ? mode(state.mouseMode) : mode,
        }),
        undefined,
        "setMouseMode"
      ),
    addColumn: (column) =>
      set(
        (state) => ({
          columns: [...state.columns, column],
        }),
        undefined,
        "addColumn"
      ),
    removeColumn: (index) =>
      set(
        (state) => ({
          columns: state.columns.filter((_, i) => i !== index),
        }),
        undefined,
        "removeColumn"
      ),
    setColumn: (index, column) =>
      set(
        (state) => ({
          columns: state.columns.map((c, i) => (i === index ? column : c)),
        }),
        undefined,
        "setColumn"
      ),
  }))
);
