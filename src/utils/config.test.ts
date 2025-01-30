import { describe, it, expect } from "vitest";
import { storeToConfig } from "@/utils/config";
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

describe("storeToConfig", () => {
  it("converts a store to a config", () => {
    expect(storeToConfig(store)).toBeDefined();
  });
});
