import { type Selection, type Position } from "@/store";

export const calculateSelectionFromPoints = (
  startPoint: Position | null,
  currentPoint: Position | null
): Selection | null => {
  if (!startPoint || !currentPoint) return null;
  return {
    x: Math.min(startPoint.x, currentPoint.x),
    y: Math.min(startPoint.y, currentPoint.y),
    width: Math.abs(currentPoint.x - startPoint.x),
    height: Math.abs(currentPoint.y - startPoint.y),
  };
};
