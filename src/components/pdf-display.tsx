import React, { useState, useRef, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import type {} from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { PDFSelector } from "@/components/pdf-selector";
import { useStore, Selection } from "@/store";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const SelectionBox = ({
  selection,
  scale,
  pageElementRef,
}: {
  selection: Selection;
  scale: number;
  pageElementRef: React.RefObject<HTMLDivElement>;
}) =>
  (pageElementRef.current &&
    <div
      style={{
        position: "absolute",
        left: `${selection.x || 0 * scale}px`,
        top: `${selection.y || 0 * scale}px`,
        width: `${selection.width || 0 * scale}px`,
        height: `${selection.height || 0 * scale}px`,
        outline: "1px solid blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        pointerEvents: "none",
        transform: `translate(${pageElementRef.current.offsetLeft}px, ${pageElementRef.current.offsetTop}px)`,
      }}
    />
  );

const calculateSelectionFromPoints = (
  startPoint: { x: number; y: number } | null,
  currentPoint: { x: number; y: number } | null
): Selection | null => {
  if (!startPoint || !currentPoint) return null;
  return {
    x: Math.min(startPoint.x, currentPoint.x),
    y: Math.min(startPoint.y, currentPoint.y),
    width: Math.abs(currentPoint.x - startPoint.x),
    height: Math.abs(currentPoint.y - startPoint.y),
  };
};

export function PdfDisplay() {
  const file = useStore((state) => state.file);
  const setFile = useStore((state) => state.setFile);
  const setTotalPages = useStore((state) => state.setTotalPages);
  const currentPage = useStore((state) => state.currentPage);
  const scale = useStore((state) => state.scale);
  const setCurrentPosition = useStore((state) => state.setCurrentPosition);
  const currentSelection = useStore((state) => state.currentSelection);
  const setCurrentSelection = useStore((state) => state.setCurrentSelection);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isMouseDown, setIsMouseDown] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);
  const pageElementRef = useRef<HTMLDivElement>(null);

  // Add global mouse up listener to handle out-of-bounds release
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isMouseDown) {
        setIsMouseDown(false);
        setIsSelecting(false);
        setStartPoint(null);
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isMouseDown]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
  };

  const calculateCoordinates = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      if (!pageElementRef.current) return null;

      const rect = pageElementRef.current.getBoundingClientRect();
      const x = (clientX - rect.left) / scale;
      const y = (clientY - rect.top) / scale;

      return { x, y };
    },
    [scale]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMouseDown(true);
    const coordinates = calculateCoordinates(e.clientX, e.clientY);
    setStartPoint(coordinates);
    setIsSelecting(true);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent text selection while dragging
      const currentPoint = calculateCoordinates(e.clientX, e.clientY);
      setCurrentPosition(currentPoint);

      if (!isSelecting || !startPoint || !isMouseDown) return;

      setCurrentSelection(
        calculateSelectionFromPoints(startPoint, currentPoint)
      );
    },
    [isSelecting, startPoint, currentPage, isMouseDown, calculateCoordinates]
  );

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPosition(null);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMouseDown(false);
    setIsSelecting(false);
    setStartPoint(null);
  };

  return (
    <div
      className="flex flex-col items-center"
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile?.type === "application/pdf") {
          setFile(droppedFile);
        }
      }}
    >
      {!file && <PDFSelector />}
      {file && (
        <div className="w-full">
          <div
            ref={pageRef}
            className="relative outline-0 bg-gray-100 select-none flex justify-center"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
              userSelect: "none",
            }}
          >
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              className="flex justify-center black-crosshair mt-2 shadow-lg"
            >
              <Page
                pageNumber={currentPage}
                scale={scale}
                className="relative"
                inputRef={pageElementRef}
              />
            </Document>
            {currentSelection && (
              <SelectionBox
                selection={currentSelection}
                scale={scale}
                pageElementRef={pageElementRef}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
