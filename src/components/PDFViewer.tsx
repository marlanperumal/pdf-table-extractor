import React, { useState, useRef, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { FileUp, Minus, Plus, Search } from "lucide-react";

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
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
  >
    {children}
  </button>
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

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
      {!file && (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
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
      )}

      {file && (
        <div className="w-full max-w-4xl">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setFile(null)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear PDF
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))}
                className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
              >
                <span className="sr-only">Zoom Out</span>
                <Minus className="w-5 h-5" />
              </button>
              <div className="p-2 bg-gray-500 text-white rounded-full">
                <Search className="w-5 h-5" />
              </div>
              <button
                onClick={() => setScale((prev) => Math.min(prev + 0.1, 3))}
                className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
              >
                <span className="sr-only">Zoom In</span>
                <Plus className="w-5 h-5" />
              </button>
              <span className="text-gray-700">
                Zoom: {(scale * 100).toFixed(0)}%
              </span>
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
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, numPages))
                }
              >
                Next
              </NavigationButton>
            </div>
          </div>

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
            {mousePosition && <CoordinateDisplay {...mousePosition} />}
          </div>

          {selection && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold mb-2">Selection Coordinates:</h3>
              <pre className="bg-gray-100 p-2 rounded">
                {JSON.stringify(
                  {
                    page: selection.pageNumber,
                    x: Math.round(selection.x),
                    y: Math.round(selection.y),
                    width: Math.round(selection.width),
                    height: Math.round(selection.height),
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
