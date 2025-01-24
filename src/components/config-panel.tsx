"use client";

import * as React from "react";
import {
  Save,
  Upload,
  MousePointerSquare,
  ArrowDownRightFromSquare,
  XSquare,
  BetweenVerticalStart,
  UnfoldHorizontal,
  Trash2,
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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/store";

export function ConfigPanel() {
  const currentSelection = useStore((state) => state.currentSelection);
  const setCurrentSelection = useStore((state) => state.setCurrentSelection);
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Area Selection</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Toggle
                      variant="outline"
                      onClick={() => setCurrentSelection(null)}
                    >
                      <MousePointerSquare />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select area</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Toggle
                      variant="outline"
                      onClick={() => setCurrentSelection(null)}
                    >
                      <ArrowDownRightFromSquare />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Adjust selection</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Toggle
                      variant="outline"
                      onClick={() => setCurrentSelection(null)}
                    >
                      <XSquare />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Discard selection</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Toggle
                      variant="outline"
                      onClick={() => setCurrentSelection(null)}
                    >
                      <BetweenVerticalStart />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add column</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Toggle
                      variant="outline"
                      onClick={() => setCurrentSelection(null)}
                    >
                      <UnfoldHorizontal />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Adjust column position</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Data Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>C{i + 1}</TableCell>
                    <TableCell>
                      <Input placeholder="Column name" />
                    </TableCell>
                    <TableCell>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline">
                        <Trash2 />
                      </Button>
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

      <div className="mt-auto space-y-2">
        <Button className="w-full" variant="outline">
          <Save className="mr-2 h-4 w-4" />
          Save Config
        </Button>
        <Button className="w-full" variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Load Config
        </Button>
        <Button className="w-full">Export CSV</Button>
      </div>
    </div>
  );
}
