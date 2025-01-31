import React from "react";
import {
  BetweenVerticalStart,
  ArrowRightToLine,
  UnfoldHorizontal,
  ChevronsUpDown,
  GripVertical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import { Column, useStore } from "@/store";
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
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { toSnakeCase } from "@/utils/textCases";

// Add this new component for the draggable row
function DraggableTableRow({
  column,
  index,
  columnPosition,
  removeColumn,
  updateColumnName,
  updateColumnType,
  updateColumnPosition,
}: {
  column: Column;
  index: number;
  columnPosition: number;
  removeColumn: (index: number) => void;
  updateColumnName: (index: number, name: string) => void;
  updateColumnType: (index: number, type: "string" | "number" | "date") => void;
  updateColumnPosition: (index: number, position: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `column-${toSnakeCase(column.name)}`,
    transition: null,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <div {...attributes} {...listeners}>
          <GripVertical
            size={14}
            className={cn("cursor-grab", isDragging && "cursor-grabbing")}
          />
        </div>
      </TableCell>
      <TableCell>C{index + 1}</TableCell>
      <TableCell>
        <Input
          type="number"
          className="max-w-[110px]"
          value={Math.round(columnPosition)}
          onChange={(e) => {
            updateColumnPosition(index, Number(e.target.value));
          }}
        />
      </TableCell>
      <TableCell>
        <Input
          placeholder="Column name"
          value={column.name}
          onChange={(e) => {
            updateColumnName(index, e.target.value);
          }}
        />
      </TableCell>
      <TableCell>
        <Select
          value={column.type}
          onValueChange={(value) => {
            updateColumnType(index, value as "string" | "number" | "date");
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
                onClick={() => removeColumn(index)}
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
  );
}

export function ColumnSelection() {
  const mouseMode = useStore((state) => state.mouseMode);
  const setMouseMode = useStore((state) => state.setMouseMode);
  const columns = useStore((state) => state.columns);
  const addColumn = useStore((state) => state.addColumn);
  const removeColumn = useStore((state) => state.removeColumn);
  const updateColumnName = useStore((state) => state.updateColumnName);
  const updateColumnType = useStore((state) => state.updateColumnType);
  const updateColumnPosition = useStore((state) => state.updateColumnPosition);
  const selectionPage = useStore((state) => state.selectionPage);
  const area = useStore((state) => state.area[state.selectionPage]);
  const reorderColumns = useStore((state) => state.reorderColumns);

  const columnPositions = columns.map(
    (column) => column.position[selectionPage]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = columns.findIndex(
        (column) =>
          toSnakeCase(column.name) === active.id.toString().split("-")[1]
      );
      const newIndex = columns.findIndex(
        (column) =>
          toSnakeCase(column.name) === over.id.toString().split("-")[1]
      );
      reorderColumns(oldIndex, newIndex);
    }
  };

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
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columns.map(
              (column) => `column-${toSnakeCase(column.name)}`
            )}
            strategy={verticalListSortingStrategy}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <ChevronsUpDown size={14} />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Pos</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Data Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {columns.map((column, i) => (
                  <DraggableTableRow
                    key={`column-${i}`}
                    column={column}
                    index={i}
                    columnPosition={columnPositions[i]}
                    removeColumn={removeColumn}
                    updateColumnName={updateColumnName}
                    updateColumnType={updateColumnType}
                    updateColumnPosition={updateColumnPosition}
                  />
                ))}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}
