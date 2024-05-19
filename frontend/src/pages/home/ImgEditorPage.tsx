import React, { useState, useEffect, useRef } from "react";
import { Grid, ThemeProvider } from "@mui/material";
import BalsamiqTheme from "../../themes/theme";
import DrawingApp from "../../components/img-drawing";
import SaveButton from "../../components/save-button";

const DrawingPage = () => {
  const gridRef = useRef<HTMLDivElement>(null);

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
          <DrawingApp canvasWidth={size.width} canvasHeight={size.height} />
        </Grid>
        <Grid item xs={12} style={{ height: "calc(100vh * 3/12)" }}>
          <div
            className="drawing-container"
            style={{
              position: "relative",
              width: `${size.width}px`,
              marginLeft: '50px',
              marginTop: '20px',
              display: "flex", // Use flexbox to center children
              flexDirection: "row", // Stack children vertically
              justifyContent: "flex-start", // Align children to the end (bottom)
              alignItems: "flex-end", // Center children horizontally
            }}
          >
            {/* Additional content can go here */}
            <SaveButton buttonName="Save" />
            <SaveButton buttonName="Delete selected box" />
            <SaveButton buttonName="Close image" />
          </div>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default DrawingPage;
