import * as React from "react";

import { AreaSelection } from "@/components/area-selection";
import { ColumnSelection } from "@/components/column-selection";
import { ConfigOptions } from "@/components/config-options";
import { SaveConfig } from "@/components/save-config";
import { LoadConfig } from "@/components/load-config";
import { ExportCsv } from "@/components/export-csv";
export function ConfigPanel() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="space-y-4 overflow-y-auto">
        <AreaSelection />
        <ColumnSelection />
        <ConfigOptions />
      </div>

      <div className="p-4 bg-white border-t">
        <div className="space-y-2">
          <SaveConfig />
          <LoadConfig />
          <ExportCsv />
        </div>
      </div>
    </div>
  );
}
