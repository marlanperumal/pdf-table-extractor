"use client"

import * as React from "react"
import { Save, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ConfigPanel() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="space-y-4">
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

