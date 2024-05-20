import React, { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Box, ResizeHandle } from "../pages/home/ImgEditorPage";

interface DrawingContainerProps {
  canvasWidth: number;
  canvasHeight: number;
  boxes: Box[];
  setBoxes: React.Dispatch<React.SetStateAction<Box[]>>;
  selectedBoxId: string | null;
  setSelectedBoxId: React.Dispatch<React.SetStateAction<string | null>>;
  presignedUrl: string | null;
}

const DrawingApp = ({
  canvasWidth,
  canvasHeight,
  boxes,
  setBoxes,
  selectedBoxId,
  setSelectedBoxId,
  presignedUrl,
}: DrawingContainerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [selectedHandle, setSelectedHandle] = useState<ResizeHandle | null>(
    null
  );
  const [backgroundImageLoaded, setBackgroundImageLoaded] = useState(false);
  const colour = "#ff00ff";

  // draw the box
  const drawBox = (ctx: CanvasRenderingContext2D, box: Box): void => {
    ctx.beginPath();
    ctx.lineWidth = 4.5;
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
      image.src = presignedUrl ? presignedUrl : "";
      image.onload = () => {
        ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);
        setBackgroundImageLoaded(true);
      };
    }
  }, [backgroundImageLoaded, presignedUrl]);

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
    const size = 25;
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

  // ... rest of the component

  return (
    <div
      className="drawing-container"
      style={{
        position: "relative",
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
        margin: "50px",
        boxShadow: "0px 0px 10px #ccc",
        backgroundColor: "#fff",
        border: "4px solid #000", // Thicker border
        display: "flex", // Use flexbox to center children
        flexDirection: "column", // Stack children vertically
        justifyContent: "flex-end", // Align children to the end (bottom)
        alignItems: "flex-end", // Center children horizontally
      }}
    >
      <div
        style={{
          fontSize: "1.2rem",
          position: "absolute",
          top: "-25px", // Adjust the distance from the top border as needed
          left: "10px", // Adjust the distance from the left border as needed
          padding: "5px", // Add padding for spacing
          backgroundColor: "#fff", // Background color for the text
        }}
      >
        Cat_on_rumba.png
      </div>
      {/* Background canvas for the static image */}
      <canvas
        ref={backgroundCanvasRef}
        width={canvasWidth * 0.93}
        height={canvasHeight * 0.85}
        style={{
          position: "absolute",
          bottom: "15px", // Move to the bottom of the div
          right: "15px", // Move to the bottom of the div
          // left: "50%", // Center horizontally
          // transform: "translateX(-50%)", // Offset by half the width to center
        }}
      />

      {/* Main canvas for drawing boxes */}
      <canvas
        ref={canvasRef}
        width={canvasWidth * 0.93}
        height={canvasHeight * 0.85}
        style={{
          position: "absolute",
          bottom: "15px", // Move to the bottom of the div
          right: "15px", // Move to the bottom of the div
          // left: "50%", // Center horizontally
          // transform: "translateX(-50%)", // Offset by half the width to center
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default DrawingApp;
