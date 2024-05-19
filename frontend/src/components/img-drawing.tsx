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
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [selectedHandle, setSelectedHandle] = useState<ResizeHandle | null>(
    null
  );
  const [backgroundImageLoaded, setBackgroundImageLoaded] = useState(false);
  const colour = "#ff00ff";

  // draw the box
  const drawBox = (ctx: CanvasRenderingContext2D, box: Box): void => {
    ctx.beginPath();
    ctx.strokeStyle = colour;
    ctx.rect(box.x, box.y, box.width, box.height);
    ctx.stroke();
    ctx.closePath();
  };

  // draw the ResizeHandles
  const drawHandle = (
    ctx: CanvasRenderingContext2D,
    handle: ResizeHandle
  ): void => {
    ctx.beginPath();
    ctx.rect(handle.x, handle.y, handle.size, handle.size);
    ctx.fillStyle = colour;
    ctx.fill();
    ctx.closePath();
  };

  // Clear the canvas and redraw the boxes and the selected box's resize handles when either the boxes or the selected box changes.
  useEffect(() => {
    const backgroundCanvas = backgroundCanvasRef.current;
    const ctx = backgroundCanvas?.getContext("2d");
    if (ctx && !backgroundImageLoaded) {
      const image = new Image();
      image.src = "cat_on_rumba.jpg";
      image.onload = () => {
        ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);
        setBackgroundImageLoaded(true);
      };
    }
  }, [backgroundImageLoaded]);

  // Redraw the boxes on the main canvas without clearing the background image
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && backgroundImageLoaded) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      boxes.forEach((box) => {
        drawBox(ctx, box);
        if (box.id === selectedBoxId) {
          box.resizeHandles?.forEach((handle) => {
            drawHandle(ctx, handle);
          });
        }
      });
    }
  }, [boxes, selectedBoxId, backgroundImageLoaded]);

  // create resize handle squares in the middle of each edge of the box
  const createResizeHandles = (box: Box): ResizeHandle[] => {
    const size = 10;
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

  // based on the mouse position decided if we are: resizing, selecting or drawing a box
  const handleMouseDown = (event: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const currentX = event.clientX - (rect?.left ?? 0);
    const currentY = event.clientY - (rect?.top ?? 0);

    const [foundBox, foundHandle] = findBoxAndHandle(currentX, currentY);
    if (foundBox && foundHandle) {
      setSelectedHandle(foundHandle);
      setSelectedBoxId(foundBox.id);
      setIsResizing(true);
    } else if (foundBox) {
      setSelectedBoxId(foundBox.id);
      setIsResizing(false);
    } else {
      setSelectedBoxId(null);
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

  // check if the current mouse position is in the box or in the resize handle
  const findBoxAndHandle = (
    currentX: number,
    currentY: number
  ): [Box | undefined, ResizeHandle | undefined] => {
    for (const box of boxes) {
      const foundHandle = box.resizeHandles?.find((handle) =>
        isPointInHandle(currentX, currentY, handle)
      );
      if (foundHandle) {
        return [box, foundHandle];
      }
    }
    const foundBox = boxes.find((box) => isPointInBox(currentX, currentY, box));
    return [foundBox, undefined];
  };

  // check if we the current mouse position is inside the box
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

  // check if we the current mouse position is inside the resize handle
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

  const canvasWidth = 800; // Width in pixels
  const canvasHeight = 600; // Height in pixels

  // ... rest of the component

  return (
    <div className="drawing-container" style={{ position: 'relative', width: `${canvasWidth}px`, height: `${canvasHeight}px` }}>
      {/* Background canvas for the static image */}
      <canvas
        ref={backgroundCanvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />

      {/* Main canvas for drawing boxes */}
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ position: 'absolute', top: 0, left: 0 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default DrawingApp;
