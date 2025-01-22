import * as React from "react";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PDFViewer } from "@/components/PDFViewer";

export function PdfViewer() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = 3; // This will come from the actual PDF

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-4 border-b p-4">
        <Input type="file" accept=".pdf" className="max-w-[300px]" />
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>
      <div className="relative flex-1 overflow-auto p-4">
        <PDFViewer />
      </div>
      <div className="flex items-center justify-between border-t p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
