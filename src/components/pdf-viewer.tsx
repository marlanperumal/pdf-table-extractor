import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Search,
  Trash,
  Upload,
} from "lucide-react";
import { default as icon } from "@/red-document-icon.svg";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PdfDisplay } from "@/components/pdf-display";
import { useStore } from "@/store";

const CoordinateDisplay = ({
  currentPosition,
}: {
  currentPosition: { x: number; y: number } | null;
}) => {
  return (
    currentPosition && (
      <div
        className="absolute bg-black text-white px-2 py-1 text-sm rounded pointer-events-none"
        style={{ bottom: "1rem", right: "1rem" }}
      >
        x: {Math.round(currentPosition.x)}, y: {Math.round(currentPosition.y)}
      </div>
    )
  );
};

export function PdfViewer() {
  const [fileName, setFileName] = useState<string | null>(null);
  const setFile = useStore((state) => state.setFile);
  const currentPage = useStore((state) => state.currentPage);
  const totalPages = useStore((state) => state.totalPages);
  const increasePage = useStore((state) => state.increasePage);
  const decreasePage = useStore((state) => state.decreasePage);
  const scale = useStore((state) => state.scale);
  const increaseScale = useStore((state) => state.increaseScale);
  const decreaseScale = useStore((state) => state.decreaseScale);
  const [currentPosition, setCurrentPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    if (file) {
      setFile(file);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-4 border-b py-2 px-4">
        <img src={icon} alt="Red Document Icon" className="w-6 h-6" />
        <span className="-ml-3 text-lg font-bold">PTE</span>
        <form onSubmit={handleSubmit} className="flex flex-1 gap-2">
          <Input
            type="file"
            name="file"
            accept=".pdf"
            onChange={(e) => {
              setFileName(e.target.files?.[0]?.name || null);
            }}
          />
          <Button type="submit" disabled={!fileName}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <Button type="button" variant="outline" onClick={() => setFile(null)}>
            <Trash className="mr-2 h-4 w-4" />
            Clear PDF
          </Button>
        </form>
      </div>
      <div className="relative flex-1 overflow-auto bg-gray-100">
        <PdfDisplay setCurrentPosition={setCurrentPosition} />
        {currentPosition && (
          <CoordinateDisplay currentPosition={currentPosition} />
        )}
      </div>
      <div className="flex items-center justify-between border-t px-4 py-2">
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
          <div className="text-sm">
            {currentPage === 1 ? "First" : "Default"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={decreaseScale}
            disabled={scale <= 0.5}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            <Search />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={increaseScale}
            disabled={scale >= 1.5}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <div className="text-sm">{(scale * 100).toFixed(0)}%</div>
        </div>
      </div>
    </div>
  );
}
