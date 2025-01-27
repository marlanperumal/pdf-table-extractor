import { describe, it, expect } from "vitest";
import { calculateSelectionFromPoints } from "./selection";

describe("calculateSelectionFromPoints", () => {
  it("returns null when either point is null", () => {
    expect(calculateSelectionFromPoints(null, { x: 0, y: 0 })).toBeNull();
    expect(calculateSelectionFromPoints({ x: 0, y: 0 }, null)).toBeNull();
    expect(calculateSelectionFromPoints(null, null)).toBeNull();
  });

  it("calculates selection when dragging from top-left to bottom-right", () => {
    const startPoint = { x: 10, y: 10 };
    const currentPoint = { x: 20, y: 30 };

    const result = calculateSelectionFromPoints(startPoint, currentPoint);

    expect(result).toEqual({
      x: 10,
      y: 10,
      width: 10,
      height: 20,
    });
  });

  it("calculates selection when dragging from bottom-right to top-left", () => {
    const startPoint = { x: 20, y: 30 };
    const currentPoint = { x: 10, y: 10 };

    const result = calculateSelectionFromPoints(startPoint, currentPoint);

    expect(result).toEqual({
      x: 10,
      y: 10,
      width: 10,
      height: 20,
    });
  });

  it("calculates selection when dragging diagonally", () => {
    const startPoint = { x: 20, y: 10 };
    const currentPoint = { x: 10, y: 30 };

    const result = calculateSelectionFromPoints(startPoint, currentPoint);

    expect(result).toEqual({
      x: 10,
      y: 10,
      width: 10,
      height: 20,
    });
  });
});
