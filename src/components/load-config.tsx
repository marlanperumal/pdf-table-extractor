import * as React from "react";
import { Upload } from "lucide-react";
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
import { Config, fromSnakeCase } from "@/utils/config";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function LoadConfig() {
  const setColumns = useStore((state) => state.setColumns);
  const setCurrentSelection = useStore((state) => state.setCurrentSelection);
  const setDateFormat = useStore((state) => state.setDateFormat);
  const setTransDetail = useStore((state) => state.setTransDetail);
  const setDropna = useStore((state) => state.setDropna);
  const [configFile, setConfigFile] = React.useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setConfigFile(file);
    }
  };

  const loadConfig = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!configFile) return;
    const config = JSON.parse(
      new TextDecoder().decode(await configFile.arrayBuffer())
    ) as Config;
    const area = config.layout.default.area;
    const columnPositions = config.layout.default.columns;
    setColumns(
      Object.entries(config.columns).map(([key, value], index) => ({
        name: value,
        type: config.cleaning.numeric.includes(key)
          ? "number"
          : config.cleaning.date.includes(key)
          ? "date"
          : "string",
        x: columnPositions[index],
      }))
    );
    setCurrentSelection({
      x: area[1],
      y: area[0],
      width: area[3] - area[1],
      height: area[2] - area[0],
    });
    setDateFormat(config.cleaning.date_format ?? "%y/%m/%d");
    setTransDetail(config.cleaning.trans_detail ?? "");
    setDropna(
      config.cleaning.dropna?.map((columnName) => fromSnakeCase(columnName)) ??
        []
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Load Config
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={loadConfig}>
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
                id="configFile"
                type="file"
                accept=".json"
                className="col-span-3"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">Load</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
