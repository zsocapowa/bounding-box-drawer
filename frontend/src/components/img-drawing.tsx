import React, { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface Box {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  resizeHandles?: ResizeHandle[];
}

interface ResizeHandle {
  position: "mt" | "mb" | "ml" | "mr";
  x: number;
  y: number;
  size: number;
}

const DrawingApp = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [selectedHandle, setSelectedHandle] = useState<ResizeHandle | null>(
    null
  );

  // setup the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      boxes.forEach((box) => {
        ctx.beginPath();
        ctx.strokeStyle = "#ff00ff";
        ctx.rect(box.x, box.y, box.width, box.height);
        if (box.id === selectedBoxId) {
          ctx.stroke();
          box.resizeHandles?.forEach((handle) => {
            ctx.beginPath();
            ctx.rect(handle.x, handle.y, handle.size, handle.size);
            ctx.fillStyle = "#ff00ff";
            ctx.fill();
            ctx.closePath();
          });
        } else {
          ctx.stroke();
        }
        ctx.closePath();
      });
    }
  }, [boxes, selectedBoxId]);

  const createResizeHandles = (box: Box): ResizeHandle[] => {
    const size = 10; // Size of the resize handle squares
    return [
      {
        position: "mt",
        x: box.x + box.width / 2 - size / 2,
        y: box.y - size / 2,
        size,
      }, // Middle-Top
      {
        position: "mb",
        x: box.x + box.width / 2 - size / 2,
        y: box.y + box.height - size / 2,
        size,
      }, // Middle-Bottom
      {
        position: "ml",
        x: box.x - size / 2,
        y: box.y + box.height / 2 - size / 2,
        size,
      }, // Middle-Left
      {
        position: "mr",
        x: box.x + box.width - size / 2,
        y: box.y + box.height / 2 - size / 2,
        size,
      }, // Middle-Right
    ];
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const currentX = event.clientX - (rect?.left ?? 0);
    const currentY = event.clientY - (rect?.top ?? 0);

    const foundBox = boxes.find((box) => isPointInBox(currentX, currentY, box));
    if (foundBox) {
      const foundHandle = foundBox.resizeHandles?.find((handle) =>
        isPointInHandle(currentX, currentY, handle)
      );
      if (foundHandle) {
        setSelectedHandle(foundHandle);
        setSelectedBoxId(foundBox.id);
        setIsResizing(true);
      } else {
        setSelectedBoxId(foundBox.id); // Set the selected box ID
        setIsResizing(false);
      }
    } else {
      setSelectedBoxId(null); // Deselect any box if we click outside
      const newBox: Box = {
        id: uuidv4(),
        x: currentX,
        y: currentY,
        width: 0,
        height: 0,
      };
      setBoxes((prevState) => [...prevState, newBox]);
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDrawing && !isResizing) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    const currentX = event.clientX - (rect?.left ?? 0);
    const currentY = event.clientY - (rect?.top ?? 0);

    if (isDrawing) {
      setBoxes((currentBoxes) => {
        const newBoxes = [...currentBoxes];
        const lastBox = newBoxes[newBoxes.length - 1];
        if (lastBox) {
          lastBox.width = currentX - lastBox.x;
          lastBox.height = currentY - lastBox.y;
        }
        return newBoxes;
      });
    } else if (isResizing && selectedBoxId && selectedHandle) {
      setBoxes((currentBoxes) => {
        return currentBoxes.map((box) => {
          if (box.id !== selectedBoxId) return box;

          const newBox = { ...box };
          switch (selectedHandle.position) {
            case "mt":
              newBox.height += newBox.y - currentY;
              newBox.y = currentY;
              break;
            case "mb":
              newBox.height = currentY - newBox.y;
              break;
            case "ml":
              newBox.width += newBox.x - currentX;
              newBox.x = currentX;
              break;
            case "mr":
              newBox.width = currentX - newBox.x;
              break;
          }

          newBox.resizeHandles = createResizeHandles(newBox);
          return newBox;
        });
      });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setBoxes((currentBoxes) => {
        const newBoxes = [...currentBoxes];
        const lastBox = newBoxes[newBoxes.length - 1];
        if (lastBox) {
          lastBox.resizeHandles = createResizeHandles(lastBox);
        }
        return newBoxes;
      });
    } else if (isResizing) {
      setIsResizing(false);
      setSelectedHandle(null);
    }
  };

  // https://www.youtube.com/watch?v=QQSqJc9g_UA

  const isPointInBox = (
    currentX: number,
    currentY: number,
    box: Box
  ): boolean => {
    const { x, y, width, height } = box;
    return (
      currentX >= x &&
      currentX <= x + width &&
      currentY >= y &&
      currentY <= y + height
    );
  };

  const isPointInHandle = (
    currentX: number,
    currentY: number,
    handle: ResizeHandle
  ): boolean => {
    const { x, y, size } = handle;
    return (
      currentX >= x &&
      currentX <= x + size &&
      currentY >= y &&
      currentY <= y + size
    );
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export default DrawingApp;
