import * as React from "react";
import {
  SquareMousePointer,
  ArrowDownRightFromSquare,
  XSquare,
  BetweenVerticalStart,
  UnfoldHorizontal,
  Trash2,
  ArrowRightToLine,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SaveConfig } from "@/components/save-config";
import { LoadConfig } from "@/components/load-config";
import { useStore } from "@/store";

export function ConfigPanel() {
  const currentSelection = useStore((state) => state.currentSelection);
  const setCurrentSelection = useStore((state) => state.setCurrentSelection);
  const mouseMode = useStore((state) => state.mouseMode);
  const setMouseMode = useStore((state) => state.setMouseMode);
  const columns = useStore((state) => state.columns);
  const addColumn = useStore((state) => state.addColumn);
  const removeColumn = useStore((state) => state.removeColumn);
  const setColumn = useStore((state) => state.setColumn);
  const clearCurrentSelection = useStore(
    (state) => state.clearCurrentSelection
  );

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="space-y-4 overflow-y-auto">
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
                        setMouseMode(
                          mouseMode === "resize" ? "select" : "resize"
                        )
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
                        currentSelection?.y
                          ? currentSelection?.y.toFixed(0)
                          : ""
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
                        currentSelection?.x
                          ? currentSelection?.x.toFixed(0)
                          : ""
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
                          ? (
                              currentSelection?.x + currentSelection?.width
                            ).toFixed(0)
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
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Columns</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Toggle
                      variant="outline"
                      pressed={mouseMode === "insertColumn"}
                      onPressedChange={() =>
                        setMouseMode(
                          mouseMode === "insertColumn"
                            ? "select"
                            : "insertColumn"
                        )
                      }
                    >
                      <BetweenVerticalStart />
                    </Toggle>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Insert column</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        addColumn({
                          x:
                            (currentSelection?.x ?? 0) +
                            (currentSelection?.width ?? 0),
                          name: "",
                          type: "string",
                        })
                      }
                    >
                      <ArrowRightToLine />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add column to end</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled
                      onClick={() => {}}
                    >
                      <UnfoldHorizontal />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Adjust column position</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Pos</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Data Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {columns.map((column, i) => (
                  <TableRow key={i}>
                    <TableCell>C{i + 1}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        className="max-w-[110px]"
                        value={column.x.toFixed(0)}
                        onChange={(e) => {
                          setColumn(i, {
                            ...column,
                            x: Number(e.target.value),
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Column name"
                        value={column.name}
                        onChange={(e) => {
                          setColumn(i, {
                            ...column,
                            name: e.target.value,
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={column.type}
                        onValueChange={(value) => {
                          setColumn(i, {
                            ...column,
                            type: value as "string" | "number" | "date",
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Data type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => removeColumn(i)}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove column</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Other Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Add other configuration options here */}
          </CardContent>
        </Card>
      </div>

      <div className="p-4 bg-white border-t">
        <div className="space-y-2">
          <SaveConfig />
          <LoadConfig />
          <Button className="w-full">Export CSV</Button>
        </div>
      </div>
    </div>
  );
}
