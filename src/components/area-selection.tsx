import React, { useCallback } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const setSelectionPage = useStore((state) => state.setSelectionPage);
  const currentArea = useStore(
    (state) => state.config.layout[selectionPage]?.area
  );
  const setCurrentArea = useStore((state) => state.setArea);
  const clearCurrentSelection = useStore(
    (state) => state.clearCurrentSelection
  );
  const perPage = useStore((state) => state.perPage);
  const setPerPage = useStore((state) => state.setPerPage);

  const handleAreaChange = useCallback(
    (index: number, value: number | null) => {
      setCurrentArea((prev) => {
        const newArea = [...prev];
        newArea[index] = value;
        return newArea;
      });
    },
    [setCurrentArea]
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
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
          <div className="flex items-center space-x-2 justify-end">
            <Switch
              id="per-page"
              checked={perPage}
              onCheckedChange={setPerPage}
            />
            <Label htmlFor="per-page">First page</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {perPage && (
          <Tabs
            className="h-full flex flex-col"
            value={selectionPage}
            onValueChange={(value) =>
              setSelectionPage(value as "default" | "first")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="default">Default</TabsTrigger>
              <TabsTrigger value="first">First Page</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Top&nbsp;(Y1)</TableCell>
              <TableCell>
                <Input
                  type="number"
                  placeholder="Top (Y1)"
                  value={currentArea?.[0] ? currentArea?.[0].toFixed(0) : ""}
                  onChange={(e) => handleAreaChange(0, Number(e.target.value))}
                />
              </TableCell>
              <TableCell>Left&nbsp;(X1)</TableCell>
              <TableCell>
                <Input
                  type="number"
                  placeholder="Left (X1)"
                  value={currentArea?.[1] ? currentArea?.[1].toFixed(0) : ""}
                  onChange={(e) => handleAreaChange(1, Number(e.target.value))}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bottom&nbsp;(Y2)</TableCell>
              <TableCell>
                <Input
                  type="number"
                  placeholder="Bottom (Y2)"
                  value={currentArea?.[2] ? currentArea?.[2].toFixed(0) : ""}
                  onChange={(e) => handleAreaChange(2, Number(e.target.value))}
                />
              </TableCell>
              <TableCell>Right&nbsp;(X2)</TableCell>
              <TableCell>
                <Input
                  type="number"
                  placeholder="Right (X2)"
                  value={currentArea?.[3] ? currentArea?.[3].toFixed(0) : ""}
                  onChange={(e) => handleAreaChange(3, Number(e.target.value))}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
