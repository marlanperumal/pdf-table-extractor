import React, { useState, useRef, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import type {} from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { PDFSelector } from "@/components/pdf-selector";
import { useStore, type Selection, type Area } from "@/store";
import { calculateSelectionFromPoints } from "@/utils/selection";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const SelectionBox = ({
  selection,
  scale,
  pageElementRef,
}: {
  selection: Selection | null;
  scale: number;
  pageElementRef: React.RefObject<HTMLDivElement>;
}) =>
  pageElementRef.current &&
  selection && (
    <div
      style={{
        position: "absolute",
        left: `${selection.x! * scale}px`,
        top: `${selection.y! * scale}px`,
        width: `${selection.width! * scale}px`,
        height: `${selection.height! * scale}px`,
        outline: "1px solid blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        pointerEvents: "none",
        transform: `translate(${pageElementRef.current.offsetLeft}px, ${pageElementRef.current.offsetTop}px)`,
      }}
    />
  );

const ColumnGuide = ({
  index,
  position,
  scale,
  pageElementRef,
  selection,
}: {
  index: number;
  position: number;
  scale: number;
  pageElementRef: React.RefObject<HTMLDivElement>;
  selection: Selection;
}) => (
  <div
    className="absolute border-l-2 border-red-500"
    style={{
      left: `${position * scale}px`,
      top: selection?.y ? selection.y * scale - 20 : 0,
      height: selection?.height ? selection.height * scale + 20 : 0,
      transform: `translate(${pageElementRef.current?.offsetLeft ?? 0}px, ${
        pageElementRef.current?.offsetTop ?? 0
      }px)`,
    }}
  >
    <div
      className="text-xs font-medium text-red-500 mb-1"
      style={{ transform: "translateX(-100%)" }}
    >
      C{index + 1}&nbsp;
    </div>
  </div>
);

export function PdfDisplay({
  setCurrentPosition,
}: {
  setCurrentPosition: (position: { x: number; y: number } | null) => void;
}) {
  const file = useStore((state) => state.file);
  const setFile = useStore((state) => state.setFile);
  const setTotalPages = useStore((state) => state.setTotalPages);
  const currentPage = useStore((state) => state.currentPage);
  const scale = useStore((state) => state.scale);
  const area = useStore((state) => state.area[state.selectionPage]);
  const columns = useStore((state) => state.columns);
  const selectionPage = useStore((state) => state.selectionPage);
  const columnPositions = columns.map(
    (column) => column.position[selectionPage]
  );
  const setArea = useStore((state) => state.setArea);
  const mouseMode = useStore((state) => state.mouseMode);
  const addColumn = useStore((state) => state.addColumn);

  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectionBox, setSelectionBox] = useState<Selection | null>(null);

  const pageRef = useRef<HTMLDivElement>(null);
  const pageElementRef = useRef<HTMLDivElement>(null);

  const areaToSelectionBox = useCallback((area: Area | null) => {
    if (area) {
      return {
        x: area.x1!,
        y: area.y1!,
        width: area.x2! - area.x1!,
        height: area.y2! - area.y1!,
      };
    }
    return null;
  }, []);

  useEffect(() => {
    setSelectionBox(areaToSelectionBox(area));
  }, [areaToSelectionBox, area]);

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

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsMouseDown(true);
      const coordinates = calculateCoordinates(e.clientX, e.clientY);
      setStartPoint(coordinates);
      if (mouseMode === "select") {
        setIsSelecting(true);
      } else if (mouseMode === "insertColumn") {
        addColumn({
          name: "",
          type: "string",
          position: coordinates?.x ?? 0,
        });
      }
    },
    [
      calculateCoordinates,
      addColumn,
      setStartPoint,
      setIsSelecting,
      setIsMouseDown,
      mouseMode,
    ]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent text selection while dragging
      const currentPoint = calculateCoordinates(e.clientX, e.clientY);
      setCurrentPosition(currentPoint);

      if (!isSelecting || !startPoint || !isMouseDown) return;

      const selection = calculateSelectionFromPoints(startPoint, currentPoint);
      setSelectionBox(selection);
    },
    [
      isSelecting,
      startPoint,
      isMouseDown,
      calculateCoordinates,
      setSelectionBox,
      setCurrentPosition,
    ]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setCurrentPosition(null);
      setSelectionBox(areaToSelectionBox(area));
    },
    [areaToSelectionBox, setCurrentPosition, setSelectionBox, area]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const currentPoint = calculateCoordinates(e.clientX, e.clientY);
      setIsMouseDown(false);
      if (mouseMode === "select") {
        setIsSelecting(false);
        if (startPoint && currentPoint) {
          const area = {
            x1: Math.min(startPoint.x, currentPoint.x),
            y1: Math.min(startPoint.y, currentPoint.y),
            x2: Math.max(startPoint.x, currentPoint.x),
            y2: Math.max(startPoint.y, currentPoint.y),
          };
          setArea(area);
        }
        setStartPoint(null);
      }
    },
    [
      startPoint,
      setArea,
      calculateCoordinates,
      setIsSelecting,
      setIsMouseDown,
      mouseMode,
    ]
  );

  const cursorClass = {
    select: "black-crosshair",
    move: "default",
    resize: "default",
    insertColumn: "insert-column",
  };

  const crosshairCursor = cursorClass[mouseMode ?? "select"];

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
              className={`flex justify-center ${crosshairCursor} mt-2 shadow-lg`}
            >
              <Page
                pageNumber={currentPage}
                scale={scale}
                className="relative"
                inputRef={pageElementRef}
              />
            </Document>
            {selectionBox && (
              <SelectionBox
                selection={selectionBox}
                scale={scale}
                pageElementRef={pageElementRef}
              />
            )}
            {selectionBox &&
              columnPositions.length > 0 &&
              columnPositions.map((position, index) => (
                <ColumnGuide
                  key={index}
                  index={index}
                  position={position}
                  scale={scale}
                  pageElementRef={pageElementRef}
                  selection={selectionBox}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
