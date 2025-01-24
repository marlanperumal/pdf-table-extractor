"use client"

import * as React from "react"
import { Save, Upload, MousePointerSquareDashed } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/store"

export function ConfigPanel() {
  const currentSelection = useStore((state) => state.currentSelection);
  const setCurrentSelection = useStore((state) => state.setCurrentSelection);
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>
                Area Selection
              </CardTitle>
              <Toggle onClick={() => setCurrentSelection(null)}><MousePointerSquareDashed /></Toggle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    Top (Y1)
                  </TableCell>
                  <TableCell>
                    <Input type="number" placeholder="Top (Y1)" value={currentSelection?.y?.toFixed(0) ?? ""} onChange={(e) => setCurrentSelection(currentSelection ? {...currentSelection, y: Number(e.target.value)} : null)}/>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Left (X1)
                  </TableCell>
                  <TableCell>
                    <Input type="number" placeholder="Left (X1)" value={currentSelection?.x && currentSelection?.width ? (currentSelection?.x + currentSelection?.width).toFixed(0) : ""} onChange={(e) => setCurrentSelection(currentSelection ? {...currentSelection, x: Number(e.target.value)} : null)}/>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Bottom (Y2)
                  </TableCell>
                  <TableCell>
                    <Input type="number" placeholder="Bottom (Y2)" value={(currentSelection?.y && currentSelection?.height ? (currentSelection?.y + currentSelection?.height).toFixed(0) : "")} onChange={(e) => setCurrentSelection(currentSelection ? {...currentSelection, y: Number(e.target.value)} : null)}/>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Right (X2)
                  </TableCell>
                  <TableCell>
                    <Input type="number" placeholder="Right (X2)" value={(currentSelection?.x && currentSelection?.width ? (currentSelection?.x + currentSelection?.width).toFixed(0) : "")} onChange={(e) => setCurrentSelection(currentSelection ? {...currentSelection, x: Number(e.target.value)} : null)}/>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Columns</CardTitle>
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
          <CardContent className="space-y-2">{/* Add other configuration options here */}</CardContent>
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
  )
}

