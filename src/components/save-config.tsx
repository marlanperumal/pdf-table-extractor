import * as React from "react";
import { Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useStore } from "@/store";
import { Config, toSnakeCase } from "@/utils/config";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function SaveConfig() {
  const currentSelection = useStore((state) => state.currentSelection);
  const columns = useStore((state) => state.columns);
  const [configFilename, setConfigFilename] = React.useState("config.json");
  const saveConfig = () => {
    const config: Config = {
      $schema:
        "https://raw.githubusercontent.com/marlanperumal/pdf_statement_reader/develop/pdf_statement_reader/config/psr_config.schema.json",
      layout: {
        default: {
          area: [
            currentSelection?.y ?? 0,
            currentSelection?.x ?? 0,
            (currentSelection?.y ?? 0) + (currentSelection?.height ?? 0),
            (currentSelection?.x ?? 0) + (currentSelection?.width ?? 0),
          ].map((value) => Math.round(value)),
          columns: columns.map((column) => Math.round(column.x)),
        },
      },
      columns: Object.fromEntries(
        columns.map((column) => [toSnakeCase(column.name), column.name])
      ),
      order: columns.map((column) => toSnakeCase(column.name)),
      cleaning: {
        numeric: columns
          .filter((column) => column.type === "number")
          .map((column) => toSnakeCase(column.name)),
        date: columns
          .filter((column) => column.type === "date")
          .map((column) => toSnakeCase(column.name)),
        date_format: "%d/%m/%Y",
      },
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = configFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          <Save className="mr-2 h-4 w-4" />
          Save Config
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Configuration</DialogTitle>
          <DialogDescription>
            Enter a filename to save the configuration.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Filename
            </Label>
            <Input
              id="configFilename"
              className="col-span-3"
              value={configFilename}
              onChange={(e) => setConfigFilename(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" onClick={saveConfig}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
