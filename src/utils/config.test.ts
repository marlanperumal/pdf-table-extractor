import { describe, it, expect } from "vitest";
import { Config, configToStore, storeToConfig } from "@/utils/config";
import { State } from "@/store";

const store: State = {
  file: null,
  currentPage: 0,
  totalPages: 0,
  scale: 1,
  columns: [],
  area: { default: null, first: null },
  mouseMode: "select",
  selectionPage: "first",
  dateFormat: "%y/%m/%d",
  transDetail: "all",
  dropna: [],
};

const config: Config = {
  columns: {
    column_1: "Column 1",
    column_2: "Column 2",
  },
  layout: {
    default: { area: [0, 0, 0, 0], columns: [0, 1] },
    first: { area: [0, 0, 0, 0], columns: [0, 1] },
  },
  cleaning: {
    date_format: "%y/%m/%d",
    trans_detail: "all",
    dropna: ["column_1"],
    numeric: ["column_1"],
    date: ["column_2"],
  },
  order: ["column_1", "column_2"],
  $schema: "",
};

describe("storeToConfig", () => {
  it("converts a store to a config", () => {
    expect(storeToConfig(store)).toBeDefined();
  });
});

describe("configToStore", () => {
  it("converts a config to a store", () => {
    expect(configToStore(config)).toBeDefined();
  });
});
