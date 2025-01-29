import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Document, Page, pdfjs } from "react-pdf";
import type {} from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { PDFSelector } from "@/components/pdf-selector";
import { useStore, type Selection, Column } from "@/store";
import { calculateSelectionFromPoints } from "@/utils/selection";

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
  pageElementRef.current && (
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
  column,
  scale,
  pageElementRef,
  currentSelection,
}: {
  index: number;
  column: Column;
  scale: number;
  pageElementRef: React.RefObject<HTMLDivElement>;
  currentSelection: Selection;
}) => (
  <div
    className="absolute border-l-2 border-red-500"
    style={{
      left: `${column.x * scale}px`,
      top: currentSelection?.y ? currentSelection.y * scale - 20 : 0,
      height: currentSelection?.height
        ? currentSelection.height * scale + 20
        : 0,
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

export function PdfDisplay() {
  const file = useStore((state) => state.file);
  const setFile = useStore((state) => state.setFile);
  const setTotalPages = useStore((state) => state.setTotalPages);
  const currentPage = useStore((state) => state.currentPage);
  const scale = useStore((state) => state.scale);
  const setCurrentPosition = useStore((state) => state.setCurrentPosition);
  // const currentSelection = useStore((state) => state.currentSelection);
  const setCurrentSelection = useStore((state) => state.setCurrentSelection);
  const setArea = useStore((state) => state.setArea);
  const mouseMode = useStore((state) => state.mouseMode);
  const columns = useStore((state) => state.columns);
  const addColumn = useStore((state) => state.addColumn);

  const selectionPage = useStore((state) => state.selectionPage);
  const currentArea = useStore(
    (state) => state.config.layout[selectionPage]?.area ?? []
  );
  const currentSelection = useMemo(
    () =>
      currentArea.length === 4
        ? {
            x: currentArea?.[1] ?? null,
            y: currentArea?.[0] ?? null,
            width: (currentArea?.[3] ?? 0) - (currentArea?.[1] ?? 0),
            height: (currentArea?.[2] ?? 0) - (currentArea?.[0] ?? 0),
          }
        : null,
    [currentArea]
  );
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
    if (mouseMode === "select") {
      setIsSelecting(true);
    } else if (mouseMode === "insertColumn") {
      addColumn({ x: coordinates?.x ?? 0, name: "", type: "string" });
    }
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent text selection while dragging
      const currentPoint = calculateCoordinates(e.clientX, e.clientY);
      setCurrentPosition(currentPoint);

      if (!isSelecting || !startPoint || !isMouseDown) return;

      const selection = calculateSelectionFromPoints(startPoint, currentPoint);
      setCurrentSelection(selection);
      const area = currentPoint
        ? [
            Math.min(startPoint.y, currentPoint.y),
            Math.min(startPoint.x, currentPoint.x),
            Math.max(startPoint.y, currentPoint.y),
            Math.max(startPoint.x, currentPoint.x),
          ]
        : [];
      setArea(area);
    },
    [
      isSelecting,
      startPoint,
      isMouseDown,
      calculateCoordinates,
      setCurrentSelection,
      setCurrentPosition,
      setArea,
    ]
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
            {currentSelection && (
              <SelectionBox
                selection={currentSelection}
                scale={scale}
                pageElementRef={pageElementRef}
              />
            )}
            {currentSelection &&
              columns.length > 0 &&
              columns.map((column, index) => (
                <ColumnGuide
                  key={index}
                  index={index}
                  column={column}
                  scale={scale}
                  pageElementRef={pageElementRef}
                  currentSelection={currentSelection}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
