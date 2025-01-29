import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  SquareMousePointer,
  ArrowDownRightFromSquare,
  XSquare,
} from "lucide-react";
import { useStore } from "@/store";

export function AreaSelection() {
  const mouseMode = useStore((state) => state.mouseMode);
  const setMouseMode = useStore((state) => state.setMouseMode);
  const currentSelection = useStore((state) => state.currentSelection);
  const setCurrentSelection = useStore((state) => state.setCurrentSelection);
  const clearCurrentSelection = useStore(
    (state) => state.clearCurrentSelection
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Area Selection</CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Toggle
                  variant="outline"
                  pressed={mouseMode === "select"}
                  onPressedChange={() => setMouseMode("select")}
                >
                  <SquareMousePointer />
                </Toggle>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Select area</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Toggle
                  variant="outline"
                  pressed={mouseMode === "resize"}
                  disabled
                  onPressedChange={() =>
                    setMouseMode(mouseMode === "resize" ? "select" : "resize")
                  }
                >
                  <ArrowDownRightFromSquare />
                </Toggle>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Adjust selection</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => clearCurrentSelection()}
                >
                  <XSquare />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Discard selection</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Top&nbsp;(Y1)</TableCell>
              <TableCell>
                <Input
                  type="number"
                  placeholder="Top (Y1)"
                  value={
                    currentSelection?.y ? currentSelection?.y.toFixed(0) : ""
                  }
                  onChange={(e) =>
                    setCurrentSelection(
                      currentSelection
                        ? {
                            ...currentSelection,
                            y: Number(e.target.value),
                            height:
                              (currentSelection?.height ?? 0) +
                              (currentSelection?.y ?? 0) -
                              Number(e.target.value),
                          }
                        : null
                    )
                  }
                />
              </TableCell>
              <TableCell>Left&nbsp;(X1)</TableCell>
              <TableCell>
                <Input
                  type="number"
                  placeholder="Left (X1)"
                  value={
                    currentSelection?.x ? currentSelection?.x.toFixed(0) : ""
                  }
                  onChange={(e) =>
                    setCurrentSelection(
                      currentSelection
                        ? {
                            ...currentSelection,
                            x: Number(e.target.value),
                            width:
                              (currentSelection?.width ?? 0) +
                              (currentSelection?.x ?? 0) -
                              Number(e.target.value),
                          }
                        : null
                    )
                  }
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bottom&nbsp;(Y2)</TableCell>
              <TableCell>
                <Input
                  type="number"
                  placeholder="Bottom (Y2)"
                  value={
                    currentSelection?.y && currentSelection?.height
                      ? (
                          currentSelection?.y + currentSelection?.height
                        ).toFixed(0)
                      : ""
                  }
                  onChange={(e) =>
                    setCurrentSelection(
                      currentSelection
                        ? {
                            ...currentSelection,
                            height:
                              Number(e.target.value) -
                              (currentSelection?.y ?? 0),
                          }
                        : null
                    )
                  }
                />
              </TableCell>
              <TableCell>Right&nbsp;(X2)</TableCell>
              <TableCell>
                <Input
                  type="number"
                  placeholder="Right (X2)"
                  value={
                    currentSelection?.x && currentSelection?.width
                      ? (currentSelection?.x + currentSelection?.width).toFixed(
                          0
                        )
                      : ""
                  }
                  onChange={(e) =>
                    setCurrentSelection(
                      currentSelection
                        ? {
                            ...currentSelection,
                            width:
                              Number(e.target.value) -
                              (currentSelection?.x ?? 0),
                          }
                        : null
                    )
                  }
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
