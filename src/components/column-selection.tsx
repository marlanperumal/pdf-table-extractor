import React from "react";
import {
  BetweenVerticalStart,
  ArrowRightToLine,
  UnfoldHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import { useStore } from "@/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

export function ColumnSelection() {
  const mouseMode = useStore((state) => state.mouseMode);
  const setMouseMode = useStore((state) => state.setMouseMode);
  const columns = useStore((state) => state.columns);
  const addColumn = useStore((state) => state.addColumn);
  const removeColumn = useStore((state) => state.removeColumn);
  const updateColumnName = useStore((state) => state.updateColumnName);
  const updateColumnType = useStore((state) => state.updateColumnType);
  const selectionPage = useStore((state) => state.selectionPage);
  const columnPositions = columns.map(
    (column) => column.position[selectionPage]
  );
  const updateColumnPosition = useStore((state) => state.updateColumnPosition);
  const area = useStore((state) => state.area[state.selectionPage]);
  return (
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
                      mouseMode === "insertColumn" ? "select" : "insertColumn"
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
                      position: area?.x2 ?? 0,
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
                    value={Math.round(columnPositions[i])}
                    onChange={(e) => {
                      updateColumnPosition(i, Number(e.target.value));
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Column name"
                    value={column.name}
                    onChange={(e) => {
                      updateColumnName(i, e.target.value);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={column.type}
                    onValueChange={(value) => {
                      updateColumnType(
                        i,
                        value as "string" | "number" | "date"
                      );
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
  );
}
