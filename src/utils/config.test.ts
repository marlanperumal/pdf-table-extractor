import { describe, it, expect } from "vitest";
import { fromSnakeCase, toSnakeCase } from "./config";

describe("toSnakeCase", () => {
  it("converts a string to snake case", () => {
    expect(toSnakeCase("Hello World")).toBe("hello_world");
  });
});

describe("fromSnakeCase", () => {
  it("converts a snake case string to a normal string", () => {
    expect(fromSnakeCase("hello_world")).toBe("Hello World");
  });
});
