import * as React from "react";

import { AreaSelection } from "@/components/area-selection";
import { ColumnSelection } from "@/components/column-selection";
import { ConfigOptions } from "@/components/config-options";
import { SaveConfig } from "@/components/save-config";
import { LoadConfig } from "@/components/load-config";
import { ExportCsv } from "@/components/export-csv";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
export function ConfigPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden p-4">
        <Tabs defaultValue="layout" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="columns">Columns</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="layout" className="h-full">
              <div className="space-y-4 pb-4">
                <AreaSelection />
                <ColumnSelection />
              </div>
            </TabsContent>
            <TabsContent value="columns" className="h-full"></TabsContent>
            <TabsContent value="options" className="h-full">
              <ConfigOptions />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <div className="sticky bottom-0 min-h-[150px] p-4 bg-white border-t">
        <div className="space-y-2">
          <SaveConfig />
          <LoadConfig />
          <ExportCsv />
        </div>
      </div>
    </div>
  );
}
