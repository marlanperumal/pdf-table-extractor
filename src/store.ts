import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Config } from "./utils/config";
import { configToStore } from "./utils/config";

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
  name: string;
  type: "string" | "number" | "date";
  position: {
    default: number;
    first: number;
  };
}

export interface ColumnInput {
  name: string;
  type: "string" | "number" | "date";
  position: number;
}

export interface Area {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export type MouseMode = "select" | "move" | "resize" | "insertColumn";

export type State = {
  file: File | null;
  currentPage: number;
  totalPages: number;
  scale: number;
  mouseMode: MouseMode | null;
  uniqueFirstPage: boolean;
  selectionPage: "default" | "first";
  columns: Column[];
  area: {
    default: Area | null;
    first: Area | null;
  };
  dateFormat: string;
  transDetail: string;
  dropna: string[];
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
  setMouseMode: (
    mode: MouseMode | null | ((mode: MouseMode | null) => MouseMode | null)
  ) => void;
  setSelectionPage: (selectionPage: "default" | "first") => void;
  addColumn: (column: ColumnInput) => void;
  removeColumn: (index: number) => void;
  updateColumnName: (index: number, name: string) => void;
  updateColumnType: (index: number, type: "string" | "number" | "date") => void;
  updateColumnPosition: (index: number, position: number) => void;
  setDateFormat: (dateFormat: string) => void;
  setTransDetail: (transDetail: string) => void;
  setDropna: (dropna: string[]) => void;
  setArea: (area: Area) => void;
  clearArea: () => void;
  loadConfig: (config: Config) => void;
  setUniqueFirstPage: (uniqueFirstPage: boolean) => void;
  reorderColumns: (oldIndex: number, newIndex: number) => void;
};

export const useStore = create<State & Action>()(
  devtools((set) => ({
    file: null,
    currentPage: 1,
    totalPages: 1,
    scale: 1,
    currentPosition: null,
    mouseMode: "select",
    selectionPage: "first",
    columns: new Array<Column>(),
    dateFormat: "%y/%m/%d",
    transDetail: "below",
    dropna: [],
    area: {
      default: null,
      first: null,
    },
    uniqueFirstPage: true,
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
          selectionPage: "default",
        }),
        undefined,
        "increasePage"
      ),
    decreasePage: () =>
      set(
        (state) => ({
          currentPage: Math.max(state.currentPage - 1, 1),
          selectionPage: state.currentPage === 2 ? "first" : "default",
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
    setMouseMode: (mode) =>
      set(
        (state) => ({
          mouseMode: typeof mode === "function" ? mode(state.mouseMode) : mode,
        }),
        undefined,
        "setMouseMode"
      ),
    setSelectionPage: (selectionPage) =>
      set(
        () => ({
          selectionPage,
        }),
        undefined,
        "setSelectionPage"
      ),
    addColumn: (column) =>
      set(
        (state) => ({
          columns: [
            ...state.columns,
            {
              ...column,
              position: { default: column.position, first: column.position },
            },
          ],
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
    updateColumnPosition: (index, position) =>
      set(
        (state) => ({
          columns: state.columns.map((c, i) =>
            i === index
              ? {
                  ...c,
                  position: {
                    ...c.position,
                    [state.selectionPage]: position,
                  },
                }
              : c
          ),
        }),
        undefined,
        "updateColumnPosition"
      ),
    updateColumnName: (index, name) =>
      set(
        (state) => ({
          columns: state.columns.map((c, i) =>
            i === index ? { ...c, name } : c
          ),
        }),
        undefined,
        "setColumnName"
      ),
    updateColumnType: (index, type) =>
      set(
        (state) => ({
          columns: state.columns.map((c, i) =>
            i === index ? { ...c, type } : c
          ),
        }),
        undefined,
        "setColumnType"
      ),
    setDateFormat: (dateFormat) =>
      set(
        () => ({
          dateFormat,
        }),
        undefined,
        "setDateFormat"
      ),
    setTransDetail: (transDetail) =>
      set(
        () => ({
          transDetail,
        }),
        undefined,
        "setTransDetail"
      ),
    setDropna: (dropna) => set(() => ({ dropna }), undefined, "setDropna"),
    setArea: (area) =>
      set(
        (state) => {
          return {
            area: {
              ...state.area,
              [state.selectionPage]: area,
              [state.selectionPage === "default" ? "first" : "default"]:
                state.area[
                  state.selectionPage === "default" ? "first" : "default"
                ] ?? area,
            },
          };
        },
        undefined,
        "setArea"
      ),
    clearArea: () =>
      set(
        (state) => ({
          area: {
            ...state.area,
            [state.selectionPage]: null,
          },
          mouseMode: "select",
        }),
        undefined,
        "clearArea"
      ),
    loadConfig: (config) =>
      set(() => configToStore(config), undefined, "loadConfig"),
    setUniqueFirstPage: (uniqueFirstPage) =>
      set(() => ({ uniqueFirstPage }), undefined, "setUniqueFirstPage"),
    reorderColumns: (oldIndex: number, newIndex: number) =>
      set((state) => {
        const newColumns = [...state.columns];
        const [movedColumn] = newColumns.splice(oldIndex, 1);
        newColumns.splice(newIndex, 0, movedColumn);
        return { columns: newColumns };
      }),
  }))
);
