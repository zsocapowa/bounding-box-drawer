import React from "react";
import Button from "@mui/material/Button";
import {
  Grid,
  Typography,
  Box,
  createTheme,
  ThemeProvider,
  ListItemText,
  List,
  ListItem,
} from "@mui/material";
import { styled } from "@mui/system";
import AppButton from "../../components/app-button";
import BalsamiqTheme from "../../themes/theme";
import ImgFilesList from "../../components/img-list";
import VerticalLine from "../../components/vertical-line";
import DrawingApp from "../../components/img-drawing";

const exampleArray = [
  "Image1.png",
  "Testfile.jpg",
  "Document.docx",
  "Presentation.pptx",
  "Spreadsheet.xlsx",
  "Audio.mp3",
  "Video.mp4",
  "Textfile.txt",
  "Codefile.js",
  "Stylesheet.css",
  "Config.json",
  "Database.db",
  "Backup.zip",
  "Archive.rar",
  "Font.ttf",
  "Presentation2.pptx",
  "Image2.png",
  "Image3.jpg",
  "Document2.docx",
  "Document3.pdf",
];

const HomePage = () => {
  return (
    <ThemeProvider theme={BalsamiqTheme}>
      <DrawingApp />
      {/* <Grid
        container
        alignItems="center"
        justifyContent="center"
        style={{ height: "100vh" }}
      >
        <Grid
          item
          xs={12}
          style={{
            height: "calc(100vh * 2/12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4">Landing Page - Bounding Box Drawer</Typography>
        </Grid>

        <Grid item xs={12} style={{ height: "calc(100vh * 6/12)" }} container>
          <VerticalLine />
        </Grid>
        <Grid item xs={12} style={{ height: "calc(100vh * 4/12)" }}>
        </Grid>
      </Grid> */}
    </ThemeProvider>
  );
};

export default HomePage;
