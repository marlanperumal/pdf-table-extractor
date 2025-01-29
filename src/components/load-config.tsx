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
import { Config } from "@/utils/config";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function LoadConfig() {
  const loadConfig = useStore((state) => state.loadConfig);
  const [configFile, setConfigFile] = React.useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setConfigFile(file);
    }
  };

  const loadConfigFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!configFile) return;
    const config = JSON.parse(
      new TextDecoder().decode(await configFile.arrayBuffer())
    ) as Config;
    loadConfig(config);
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
        <form onSubmit={loadConfigFile}>
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
