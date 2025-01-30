import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { fromSnakeCase } from "./utils/config";

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
  x: number;
}

export interface Config {
  $schema: string;
  layout: {
    default: {
      area: Array<number | null>;
      columns: Array<number>;
    };
    first: {
      area: Array<number | null>;
      columns: Array<number>;
    };
  };
  columns: {
    [key: string]: string;
  };
  order: string[];
  cleaning: {
    numeric: string[];
    date: string[];
    date_format?: string;
    trans_detail?: string;
    dropna?: string[];
  };
}

export type MouseMode = "select" | "move" | "resize" | "insertColumn";

type State = {
  file: File | null;
  currentPage: number;
  totalPages: number;
  scale: number;
  mouseMode: MouseMode | null;
  perPage: boolean;
  selectionPage: "default" | "first";
  columns: Column[];
  dateFormat: string;
  transDetail: string;
  dropna: string[];
  config: Config;
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
  setPerPage: (perPage: boolean) => void;
  setSelectionPage: (selectionPage: "default" | "first") => void;
  addColumn: (column: Column) => void;
  removeColumn: (index: number) => void;
  setColumn: (index: number, column: Column) => void;
  updateColumnPosition: (index: number, position: number) => void;
  setDateFormat: (dateFormat: string) => void;
  setTransDetail: (transDetail: string) => void;
  setDropna: (dropna: string[]) => void;
  setConfig: (config: Config) => void;
  loadConfig: (config: Config) => void;
  setArea: (
    area:
      | Array<number | null>
      | ((area: Array<number | null>) => Array<number | null>)
  ) => void;
  clearArea: () => void;
};

export const useStore = create<State & Action>()(
  devtools((set) => ({
    file: null,
    currentPage: 1,
    totalPages: 1,
    scale: 1,
    currentPosition: null,
    mouseMode: "select",
    perPage: true,
    selectionPage: "first",
    columns: new Array<Column>(),
    dateFormat: "%y/%m/%d",
    transDetail: "below",
    dropna: [],
    config: {
      $schema:
        "https://raw.githubusercontent.com/marlanperumal/pdf_statement_reader/develop/pdf_statement_reader/config/psr_config.schema.json",
      layout: {
        default: {
          area: [],
          columns: [],
        },
        first: {
          area: [],
          columns: [],
        },
      },
      columns: {},
      order: [],
      cleaning: {
        numeric: [],
        date: [],
        date_format: "",
        trans_detail: "",
        dropna: [],
      },
    },
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
    setPerPage: (perPage) =>
      set(
        () => ({
          perPage,
        }),
        undefined,
        "setPerPage"
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
          columns: [...state.columns, column],
          config: {
            ...state.config,
            layout: {
              ...state.config.layout,
              default: {
                columns: [
                  ...(state.config.layout["default"]?.columns || []),
                  column.x,
                ],
                area: state.config.layout["default"]?.area || [],
              },
              first: {
                columns: [
                  ...(state.config.layout["first"]?.columns || []),
                  column.x,
                ],
                area: state.config.layout["first"]?.area || [],
              },
            },
          },
        }),
        undefined,
        "addColumn"
      ),
    removeColumn: (index) =>
      set(
        (state) => ({
          columns: state.columns.filter((_, i) => i !== index),
          config: {
            ...state.config,
            layout: {
              ...state.config.layout,
              default: {
                columns: state.config.layout["default"].columns.filter(
                  (_, i) => i !== index
                ),
                area: state.config.layout["default"].area || [],
              },
              first: {
                columns: state.config.layout["first"].columns.filter(
                  (_, i) => i !== index
                ),
                area: state.config.layout["first"].area || [],
              },
            },
          },
        }),
        undefined,
        "removeColumn"
      ),
    updateColumnPosition: (index, position) =>
      set(
        (state) => ({
          columns: state.columns.map((c, i) =>
            i === index ? { ...c, x: position } : c
          ),
          config: {
            ...state.config,
            layout: {
              ...state.config.layout,
              [state.selectionPage]: {
                columns: state.config.layout[state.selectionPage].columns.map(
                  (_, i) => (i === index ? position : _)
                ),
                area: state.config.layout[state.selectionPage].area || [],
              },
            },
          },
        }),
        undefined,
        "updateColumnPosition"
      ),
    setColumn: (index, column) =>
      set(
        (state) => ({
          columns: state.columns.map((c, i) => (i === index ? column : c)),
        }),
        undefined,
        "setColumn"
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
    setConfig: (config) =>
      set(
        () => ({
          config,
        }),
        undefined,
        "setConfig"
      ),
    loadConfig: (config) =>
      set(
        () => {
          const columnPositions = config.layout.default.columns;
          return {
            config,
            columns: Object.entries(config.columns).map(
              ([key, value], index) => ({
                name: value,
                type: config.cleaning.numeric.includes(key)
                  ? "number"
                  : config.cleaning.date.includes(key)
                  ? "date"
                  : "string",
                x: columnPositions[index],
              })
            ),
            dateFormat: config.cleaning.date_format ?? "%y/%m/%d",
            transDetail: config.cleaning.trans_detail ?? "",
            dropna:
              config.cleaning.dropna?.map((columnName) =>
                fromSnakeCase(columnName)
              ) ?? [],
          };
        },
        undefined,
        "loadConfig"
      ),
    setArea: (area) =>
      set(
        (state) => {
          const newArea =
            typeof area === "function"
              ? area(state.config.layout[state.selectionPage]?.area ?? [])
              : area;
          return {
            config: {
              ...state.config,
              layout: {
                ...state.config.layout,
                [state.selectionPage]: {
                  area: newArea,
                  columns:
                    state.config.layout[state.selectionPage]?.columns || [],
                },
                [state.selectionPage === "default" ? "first" : "default"]: {
                  area:
                    state.config.layout[
                      state.selectionPage === "default" ? "first" : "default"
                    ]?.area.length === 4
                      ? state.config.layout[
                          state.selectionPage === "default"
                            ? "first"
                            : "default"
                        ]?.area
                      : newArea,
                  columns:
                    state.config.layout[
                      state.selectionPage === "default" ? "first" : "default"
                    ]?.columns || [],
                },
              },
            },
          };
        },
        undefined,
        "setArea"
      ),
    clearArea: () =>
      set(
        (state) => ({
          config: {
            ...state.config,
            layout: {
              ...state.config.layout,
              [state.selectionPage]: {
                area: [],
                columns:
                  state.config.layout[state.selectionPage]?.columns || [],
              },
            },
          },
          mouseMode: "select",
        }),
        undefined,
        "clearArea"
      ),
  }))
);
