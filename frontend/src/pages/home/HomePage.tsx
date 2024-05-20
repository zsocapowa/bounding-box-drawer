import { Grid, Typography, ThemeProvider } from "@mui/material";
import BalsamiqTheme from "../../themes/theme";
import VerticalLine from "../../components/vertical-line";
import { Box } from "./ImgEditorPage";

export interface HomePageProps {
  setIsHomePage: React.Dispatch<React.SetStateAction<boolean>>;
  selectedImgId: string | null;
  setSelectedImgId: React.Dispatch<React.SetStateAction<string | null>>;
  setBoxes: React.Dispatch<React.SetStateAction<Box[]>>;
  setPresignedUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

const HomePage = ({
  setIsHomePage,
  selectedImgId,
  setSelectedImgId,
  setBoxes,
  setPresignedUrl,
}: HomePageProps) => {
  return (
    <ThemeProvider theme={BalsamiqTheme}>
      <Grid
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
          <Typography variant="h4">
            Landing Page - Bounding Box Drawer
          </Typography>
        </Grid>

        <Grid item xs={12} style={{ height: "calc(100vh * 7/12)" }} container>
          <VerticalLine
            setIsHomePage={setIsHomePage}
            selectedImgId={selectedImgId}
            setSelectedImgId={setSelectedImgId}
            setBoxes={setBoxes}
            setPresignedUrl={setPresignedUrl}
          />
        </Grid>
        <Grid item xs={12} style={{ height: "calc(100vh * 3/12)" }}></Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default HomePage;
