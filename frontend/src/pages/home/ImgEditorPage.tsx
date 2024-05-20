import React, { useState, useEffect, useRef } from "react";
import { Grid, ThemeProvider } from "@mui/material";
import BalsamiqTheme from "../../themes/theme";
import DrawingApp from "../../components/img-drawing";
import SaveButton from "../../components/save-button";
import CloseButton from "../../components/close-button";
import DeleteButton from "../../components/delete-button";

export interface Box {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  resizeHandles?: ResizeHandle[];
}

export interface ResizeHandle {
  position: "mt" | "mb" | "ml" | "mr";
  x: number;
  y: number;
  size: number;
}

export interface DrawingPageProps {
  setIsHomePage: React.Dispatch<React.SetStateAction<boolean>>;
  selectedImgId: string | null;
  boxes: Box[];
  setBoxes: React.Dispatch<React.SetStateAction<Box[]>>;
  presignedUrl: string | null;
}

const DrawingPage = ({ setIsHomePage, selectedImgId, boxes, setBoxes, presignedUrl }: DrawingPageProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);

  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (gridRef.current) {
      const { width, height } = gridRef.current.getBoundingClientRect();
      const canvasWidth = width * 0.55;
      setSize({ width: canvasWidth, height });
    }
  }, []);

  return (
    <ThemeProvider theme={BalsamiqTheme}>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        style={{ height: "100vh" }}
      >
        {/* <Grid item xs={12} style={{ height: "calc(100vh * 1/12)" }}></Grid> */}
        <Grid
          item
          xs={12}
          ref={gridRef} // Attach the ref here
          style={{
            marginTop: "15px",
            height: "calc(100vh * 9/12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <DrawingApp
            canvasWidth={800} // Replace with your desired width
            canvasHeight={600} // Replace with your desired height
            boxes={boxes}
            setBoxes={setBoxes}
            selectedBoxId={selectedBoxId}
            setSelectedBoxId={setSelectedBoxId}
            presignedUrl={presignedUrl}
          />
        </Grid>
        <Grid item xs={12} style={{ height: "calc(100vh * 3/12)" }}>
          <div
            className="drawing-container"
            style={{
              position: "relative",
              width: `${size.width}px`,
              marginLeft: "50px",
              marginTop: "20px",
              display: "flex", // Use flexbox to center children
              flexDirection: "row", // Stack children vertically
              justifyContent: "flex-start", // Align children to the end (bottom)
              alignItems: "flex-end", // Center children horizontally
            }}
          >
            {/* Additional content can go here */}
            <SaveButton
              buttonName="Save"
              boxes={boxes}
              selectedImgId={selectedImgId}
            />
            <DeleteButton
              buttonName="Delete selected box"
              boxes={boxes}
              setBoxes={setBoxes}
              selectedBoxId={selectedBoxId}
              setSelectedBoxId={setSelectedBoxId}
            />
            <CloseButton
              buttonName="Close image"
              setIsHomePage={setIsHomePage}
            />
          </div>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default DrawingPage;
