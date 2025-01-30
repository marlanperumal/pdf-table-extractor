import { Area, Column, type State } from "@/store";
import { fromSnakeCase, toSnakeCase } from "./textCases";

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

const schema =
  "https://raw.githubusercontent.com/marlanperumal/pdf_statement_reader/develop/pdf_statement_reader/config/psr_config.schema.json";

export function storeToConfig(store: State): Config {
  const defaultArea = store.area.default;
  if (!defaultArea) {
    throw new Error("Default area is not defined");
  }
  const defaultColumns = store.columns.map((column) =>
    Math.round(column.position.default)
  );
  if (!defaultColumns) {
    throw new Error("Default columns are not defined");
  }
  const firstArea = store.area.first;
  if (!firstArea) {
    throw new Error("First area is not defined");
  }
  const firstColumns = store.columns.map((column) =>
    Math.round(column.position.first)
  );
  if (!firstColumns) {
    throw new Error("First columns are not defined");
  }

  const columnNames = store.columns.map((column) => column.name);
  if (!columnNames) {
    throw new Error("Columns are not defined");
  }
  return {
    $schema: schema,
    layout: {
      default: {
        area: [
          Math.round(defaultArea?.y1),
          Math.round(defaultArea?.x1),
          Math.round(defaultArea?.y2),
          Math.round(defaultArea?.x2),
        ],
        columns: defaultColumns,
      },
      first: {
        area: [
          Math.round(firstArea?.y1),
          Math.round(firstArea?.x1),
          Math.round(firstArea?.y2),
          Math.round(firstArea?.x2),
        ],
        columns: firstColumns,
      },
    },
    columns: Object.fromEntries(
      columnNames.map((column) => [toSnakeCase(column), column])
    ),
    order: columnNames.map((column) => toSnakeCase(column)),
    cleaning: {
      numeric: store.columns
        .filter((column) => column.type === "number")
        .map((column) => toSnakeCase(column.name)),
      date: store.columns
        .filter((column) => column.type === "date")
        .map((column) => toSnakeCase(column.name)),
      date_format: store.dateFormat ?? "%y/%m/%d",
      trans_detail: store.transDetail ?? "",
      dropna: store.dropna ?? [],
    },
  };
}

interface ConfigStore {
  columns: Column[];
  area: {
    default: Area;
    first: Area;
  };
  dateFormat: string;
  transDetail: string;
  dropna: string[];
}

export function configToStore(config: Config): ConfigStore {
  console.log(config);
  const columns = Object.entries(config.columns).map(([key, value], index) => ({
    name: value,
    type: config.cleaning.numeric.includes(key)
      ? "number"
      : config.cleaning.date.includes(key)
      ? "date"
      : "string",
    position: {
      default: config.layout.default.columns[index],
      first: config.layout.first.columns[index],
    },
  })) as Column[];
  const area = {
    default: {
      y1: config.layout.default.area[0],
      x1: config.layout.default.area[1],
      y2: config.layout.default.area[2],
      x2: config.layout.default.area[3],
    } as Area,
    first: {
      y1: config.layout.first.area[0],
      x1: config.layout.first.area[1],
      y2: config.layout.first.area[2],
      x2: config.layout.first.area[3],
    } as Area,
  };
  return {
    columns,
    area: {
      default: area.default,
      first: area.first,
    },
    dateFormat: config.cleaning.date_format ?? "%y/%m/%d",
    transDetail: config.cleaning.trans_detail ?? "",
    dropna:
      config.cleaning.dropna?.map((columnName) => fromSnakeCase(columnName)) ??
      [],
  };
}
