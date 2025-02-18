import React, { useRef, useEffect } from "react";
import { FileUp } from "lucide-react";
import { useStore } from "@/store";

const PdfSelector = () => {
  const setFile = useStore((state) => state.setFile);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const dropRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      dropRef.current?.classList.add("bg-gray-50");
    };
    const handleDragLeave = () => {
      dropRef.current?.classList.remove("bg-gray-50");
    };
    if (dropRef.current) {
      dropRef.current.addEventListener("dragover", handleDragOver);
      dropRef.current.addEventListener("dragleave", handleDragLeave);
    }
  }, [dropRef]);

  return (
    <label
      ref={dropRef}
      className="flex flex-col items-center justify-center w-[calc(100%-2rem)] h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 m-6"
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <FileUp className="w-12 h-12 mb-3 text-gray-400" />
        <p className="mb-2 text-sm text-gray-500">
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
        <p className="text-xs text-gray-500">PDF files only</p>
      </div>
      <input
        type="file"
        className="hidden"
        accept=".pdf"
        onChange={handleFileChange}
      />
    </label>
  );
};

export { PdfSelector as PDFSelector };
