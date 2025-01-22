import React, { useState, useRef, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Minus, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PDFSelector } from "@/components/PDFSelector";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface Selection {
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
}

const NavigationButton = ({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    size="lg"
    className="bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
  >
    {children}
  </Button>
);

const CoordinateDisplay = ({ x, y }: { x: number; y: number }) => (
  <div
    className="fixed bg-black text-white px-2 py-1 text-sm rounded pointer-events-none"
    style={{ bottom: "1rem", right: "1rem" }}
  >
    x: {Math.round(x)}, y: {Math.round(y)}
  </div>
);

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
        left: `${selection.x * scale}px`,
        top: `${selection.y * scale}px`,
        width: `${selection.width * scale}px`,
        height: `${selection.height * scale}px`,
        outline: "1px solid blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        pointerEvents: "none",
        transform: `translate(${pageElementRef.current.offsetLeft}px, ${pageElementRef.current.offsetTop}px)`,
      }}
    />
  );

const SelectionDisplay = ({ selection }: { selection: Selection }) => (
  <div className="mt-4 p-4 bg-white rounded-lg shadow">
    <h3 className="font-semibold mb-2">Selection Coordinates:</h3>
    <pre className="bg-gray-100 p-2 rounded">
      {JSON.stringify(selection, null, 2)}
    </pre>
  </div>
);

const PDFNav = ({
  setFile,
  setScale,
  setCurrentPage,
  numPages,
  scale,
  currentPage,
}: {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  numPages: number;
  scale: number;
  currentPage: number;
}) => (
  <div className="flex justify-between items-center mb-4">
    <Button
      onClick={() => setFile(null)}
      size="lg"
      className="bg-red-500 text-white rounded hover:bg-red-600"
    >
      Clear PDF
    </Button>
    <div className="flex items-center gap-2">
      <Button
        onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))}
        size="icon"
        className="bg-gray-500 text-white rounded-full hover:bg-gray-600"
      >
        <span className="sr-only">Zoom Out</span>
        <Minus className="w-5 h-5" />
      </Button>
      <div className="p-2 bg-gray-500 text-white rounded-full">
        <Search className="w-5 h-5" />
      </div>
      <Button
        onClick={() => setScale((prev) => Math.min(prev + 0.1, 3))}
        className="bg-gray-500 text-white rounded-full hover:bg-gray-600"
        size="icon"
      >
        <span className="sr-only">Zoom In</span>
        <Plus className="w-5 h-5" />
      </Button>
      <span className="text-gray-700">Zoom: {(scale * 100).toFixed(0)}%</span>
    </div>
    <div className="flex items-center gap-4">
      <NavigationButton
        disabled={currentPage <= 1}
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      >
        Previous
      </NavigationButton>
      <span>
        Page {currentPage} of {numPages}
      </span>
      <NavigationButton
        disabled={currentPage >= numPages}
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, numPages))}
      >
        Next
      </NavigationButton>
    </div>
  </div>
);

const PDFDisplay = ({
  file,
  pageRef,
  pageElementRef,
  onDocumentLoadSuccess,
  currentPage,
  scale,
  selection,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleMouseLeave,
}: {
  file: File;
  pageRef: React.RefObject<HTMLDivElement>;
  pageElementRef: React.RefObject<HTMLDivElement>;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
  currentPage: number;
  scale: number;
  selection: Selection | null;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: (e: React.MouseEvent) => void;
  handleMouseLeave: (e: React.MouseEvent) => void;
}) => (
  <div
    ref={pageRef}
    className="relative outline-0 shadow-lg bg-gray-100 select-none flex justify-center"
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
      className="flex justify-center black-crosshair"
    >
      <Page
        pageNumber={currentPage}
        scale={scale}
        className="relative"
        inputRef={pageElementRef}
      />
      {selection && (
        <SelectionBox
          selection={selection}
          scale={scale}
          pageElementRef={pageElementRef}
        />
      )}
    </Document>
  </div>
);

const calculateSelectionFromPoints = (
  startPoint: { x: number; y: number },
  currentPoint: { x: number; y: number },
  currentPage: number
): Selection => ({
  x: Math.min(startPoint.x, currentPoint.x),
  y: Math.min(startPoint.y, currentPoint.y),
  width: Math.abs(currentPoint.x - startPoint.x),
  height: Math.abs(currentPoint.y - startPoint.y),
  pageNumber: currentPage,
});

export function PDFViewer() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.4);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

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
    setNumPages(numPages);
  };

  const calculateCoordinates = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } => {
      if (!pageElementRef.current) return { x: 0, y: 0 };

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
      setMousePosition(currentPoint);

      if (!isSelecting || !startPoint || !isMouseDown) return;

      setSelection(
        calculateSelectionFromPoints(startPoint, currentPoint, currentPage)
      );
    },
    [isSelecting, startPoint, currentPage, isMouseDown, calculateCoordinates]
  );

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    setMousePosition(null);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMouseDown(false);
    setIsSelecting(false);
    setStartPoint(null);
  };

  return (
    <div
      className="flex flex-col items-center gap-4 p-4 min-h-screen bg-gray-50"
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
      {!file && <PDFSelector onSelectFile={setFile} />}
      {file && (
        <div className="w-full max-w-4xl">
          <PDFNav
            setFile={setFile}
            setScale={setScale}
            setCurrentPage={setCurrentPage}
            numPages={numPages}
            scale={scale}
            currentPage={currentPage}
          />
          <PDFDisplay
            file={file}
            pageRef={pageRef}
            pageElementRef={pageElementRef}
            onDocumentLoadSuccess={onDocumentLoadSuccess}
            currentPage={currentPage}
            scale={scale}
            selection={selection}
            handleMouseDown={handleMouseDown}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            handleMouseLeave={handleMouseLeave}
          />
          {mousePosition && <CoordinateDisplay {...mousePosition} />}
          {selection && <SelectionDisplay selection={selection} />}
        </div>
      )}
    </div>
  );
}
