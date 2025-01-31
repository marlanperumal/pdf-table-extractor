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
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { storeToConfig } from "@/utils/config";

export function SaveConfig() {
  const store = useStore();
  const [configFilename, setConfigFilename] = React.useState("config.json");
  const disabled = !store.file || !store.columns.length || !store.area.default;
  const saveConfig = () => {
    const config = storeToConfig(store);
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
        <Button className="w-full" variant="outline" disabled={disabled}>
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
