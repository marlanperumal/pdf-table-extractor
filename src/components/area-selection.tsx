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
  const selectionPage = useStore((state) => state.selectionPage);
  const currentArea = useStore((state) => state.area[selectionPage]);
  const setCurrentArea = useStore((state) => state.setArea);
  const clearArea = useStore((state) => state.clearArea);

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
                  onClick={() => clearArea()}
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
                  value={currentArea ? currentArea.y1.toFixed(0) : ""}
                  onChange={(e) =>
                    setCurrentArea({
                      ...(currentArea || { x1: 0, y1: 0, x2: 0, y2: 0 }),
                      y1: Number(e.target.value),
                    })
                  }
                />
              </TableCell>
              <TableCell>Left&nbsp;(X1)</TableCell>
              <TableCell>
                <Input
                  type="number"
                  placeholder="Left (X1)"
                  value={currentArea ? currentArea.x1.toFixed(0) : ""}
                  onChange={(e) =>
                    setCurrentArea({
                      ...(currentArea || { x1: 0, y1: 0, x2: 0, y2: 0 }),
                      x1: Number(e.target.value),
                    })
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
                  value={currentArea ? currentArea.y2.toFixed(0) : ""}
                  onChange={(e) =>
                    setCurrentArea({
                      ...(currentArea || { x1: 0, y1: 0, x2: 0, y2: 0 }),
                      y2: Number(e.target.value),
                    })
                  }
                />
              </TableCell>
              <TableCell>Right&nbsp;(X2)</TableCell>
              <TableCell>
                <Input
                  type="number"
                  placeholder="Right (X2)"
                  value={currentArea ? currentArea.x2.toFixed(0) : ""}
                  onChange={(e) =>
                    setCurrentArea({
                      ...(currentArea || { x1: 0, y1: 0, x2: 0, y2: 0 }),
                      x2: Number(e.target.value),
                    })
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
