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
  x: number;
  name: string;
  type: "string" | "number" | "date";
}

export interface Config {
  $schema: string;
  layout: {
    default: {
      area: Array<number | null>;
      columns: Array<number>;
    };
    first?: {
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
  currentPosition: Position | null;
  currentSelection: Selection | null;
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
  setPerPage: (perPage: boolean) => void;
  setSelectionPage: (selectionPage: "default" | "first") => void;
  addColumn: (column: Column) => void;
  removeColumn: (index: number) => void;
  setColumn: (index: number, column: Column) => void;
  setColumns: (columns: Column[]) => void;
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
    perPage: true,
    selectionPage: "default",
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
    setColumns: (columns) =>
      set(
        () => ({
          columns,
        }),
        undefined,
        "setColumns"
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
          const area = config.layout.default.area;
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
            currentSelection:
              area.length > 4
                ? {
                    x: area[1] ?? 0,
                    y: area[0] ?? 0,
                    width: (area[3] ?? 0) - (area[1] ?? 0),
                    height: (area[2] ?? 0) - (area[0] ?? 0),
                  }
                : null,
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
                [state.selectionPage]: { area: newArea },
              },
            },
          };
        },
        undefined,
        "setArea"
      ),
  }))
);
