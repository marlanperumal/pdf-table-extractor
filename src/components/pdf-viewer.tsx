import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Search,
  Trash,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PDFViewer } from "@/components/PDFViewer";
import { useStore } from "@/store";

export function PdfViewer() {
  const setFile = useStore((state) => state.setFile);
  const currentPage = useStore((state) => state.currentPage);
  const totalPages = useStore((state) => state.totalPages);
  const increasePage = useStore((state) => state.increasePage);
  const decreasePage = useStore((state) => state.decreasePage);
  const scale = useStore((state) => state.scale);
  const setScale = useStore((state) => state.setScale);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    if (file) {
      setFile(file);
      console.log("uploading file", file.name);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-4 border-b p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="file"
            name="file"
            accept=".pdf"
            className="max-w-[500px]"
          />
          <Button type="submit">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <Button type="button" variant="outline" onClick={() => setFile(null)}>
            <Trash className="mr-2 h-4 w-4" />
            Clear PDF
          </Button>
        </form>
      </div>
      <div className="relative flex-1 overflow-auto p-4">
        <PDFViewer />
      </div>
      <div className="flex items-center justify-between border-t p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => decreasePage()}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => increasePage()}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            <Search />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale((prev) => Math.min(prev + 0.1, 3))}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <div className="text-sm">{(scale * 100).toFixed(0)}%</div>
        </div>
      </div>
    </div>
  );
}
