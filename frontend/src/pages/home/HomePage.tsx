import { Grid, Typography, ThemeProvider } from "@mui/material";
import BalsamiqTheme from "../../themes/theme";
import VerticalLine from "../../components/vertical-line";

export interface HomePageProps {
  setIsHomePage: React.Dispatch<React.SetStateAction<boolean>>;
}

const HomePage = ({ setIsHomePage }: HomePageProps) => {
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

        <Grid item xs={12} style={{ height: "calc(100vh * 6/12)" }} container>
          <VerticalLine setIsHomePage={setIsHomePage} />
        </Grid>
        <Grid item xs={12} style={{ height: "calc(100vh * 4/12)" }}></Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default HomePage;
