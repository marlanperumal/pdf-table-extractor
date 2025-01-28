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
    <div className="flex h-full flex-col justify-between p-4">
      <Tabs defaultValue="layout">
        <TabsList>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="columns">Columns</TabsTrigger>
          <TabsTrigger value="options">Options</TabsTrigger>
        </TabsList>
        <TabsContent value="layout">
          <div className="space-y-4 overflow-y-auto">
            <AreaSelection />
            <ColumnSelection />
          </div>
        </TabsContent>
        <TabsContent value="columns"></TabsContent>
        <TabsContent value="options">
          <ConfigOptions />
        </TabsContent>
      </Tabs>

      <div className="min-h-[150px] p-4 bg-white border-t">
        <div className="space-y-2">
          <SaveConfig />
          <LoadConfig />
          <ExportCsv />
        </div>
      </div>
    </div>
  );
}
