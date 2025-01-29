import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/store";

export function ConfigOptions() {
  const columns = useStore((state) => state.columns);
  const dateFormat = useStore((state) => state.dateFormat);
  const transDetail = useStore((state) => state.transDetail);
  const dropna = useStore((state) => state.dropna);
  const setDateFormat = useStore((state) => state.setDateFormat);
  const setTransDetail = useStore((state) => state.setTransDetail);
  const setDropna = useStore((state) => state.setDropna);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Other Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Date Format</TableCell>
              <TableCell>
                <Input
                  id="date-format"
                  type="text"
                  placeholder="%y/%m/%d"
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Trans Detail</TableCell>
              <TableCell>
                <Input
                  id="trans-detail"
                  type="text"
                  placeholder="below"
                  value={transDetail}
                  onChange={(e) => setTransDetail(e.target.value)}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <span className="pr-2">Drop NA Columns</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline">
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {columns.map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.name}
                        checked={dropna.includes(column.name)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setDropna([...dropna, column.name]);
                          } else {
                            setDropna(dropna.filter((c) => c !== column.name));
                          }
                        }}
                      >
                        {column.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                {dropna.map((column) => (
                  <Badge key={column} variant="outline" className="mr-1">
                    {column}
                  </Badge>
                ))}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
