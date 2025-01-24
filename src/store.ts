import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type Selection = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type State = {
  file: File | null;
  currentPage: number;
  totalPages: number;
  scale: number;
  currentPosition: {
    x: number;
    y: number;
  } | null;
  currentSelection: Selection | null;
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
};

export const useStore = create<State & Action>()(
  devtools((set) => ({
    file: null,
    currentPage: 1,
    totalPages: 1,
    scale: 1,
    currentPosition: null,
    currentSelection: null,
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
  }))
);
