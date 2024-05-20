import { Grid, Typography, Box, ThemeProvider } from "@mui/material";
import BalsamiqTheme from "../themes/theme";
import UploadButton from "./upload-button";
import ImgFilesList from "./img-list";
import { useEffect, useState } from "react";
import axios from "axios";
import { HomePageProps } from "../pages/home/HomePage";
import LoadButton from "./load-button";

export interface FileItem {
  file_id: string;
  file_name: string;
}

const VerticalLine = ({
  setIsHomePage,
  selectedImgId,
  setSelectedImgId,
  setBoxes,
  setPresignedUrl,
}: HomePageProps) => {
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3333/api/images/overview"
        );
        setFiles(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid container alignItems="center" justifyContent="center">
      <ThemeProvider theme={BalsamiqTheme}>
        <Grid item xs={5} container justifyContent="center">
          <UploadButton buttonName="Open Image" setFiles={setFiles} />
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={1}>
          <Box
            style={{
              height: "calc(100vh * 6/12)",
              position: "relative",
            }}
          >
            <Box
              style={{
                borderLeft: "2px solid black",
                height: "30%",
              }}
            />
            <Box
              style={{
                borderLeft: "2px solid black",
                height: "50%",
                position: "absolute",
                bottom: "0",
              }}
            />
            <Typography
              variant="h5"
              style={{
                position: "absolute",
                top: "40%",
                left: "0%",
                transform: "translate(-50%, -50%)",
              }}
            >
              OR
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={5}
          container
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          <Typography variant="h5">Select a saved image</Typography>
          <ImgFilesList files={files} setSelectedImgId={setSelectedImgId} />
          <LoadButton
            buttonName="Load Image"
            setIsHomePage={setIsHomePage}
            selectedImgId={selectedImgId}
            setBoxes={setBoxes}
            setPresignedUrl={setPresignedUrl}
          />
        </Grid>
      </ThemeProvider>
    </Grid>
  );
};

export default VerticalLine;
