import { Grid, Typography, Box, ThemeProvider } from "@mui/material";
import BalsamiqTheme from "../themes/theme";
import AppButton from "./app-button";

const VerticalLine = () => {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      //   style={{ height: "100vh" }}
    >
      <ThemeProvider theme={BalsamiqTheme}>
        <Grid item xs={5} container justifyContent="center">
          <AppButton />
        </Grid>
        <Grid item xs={1}></Grid>
        {/* <Typography
          variant="h5"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          OR
        </Typography> */}
        <Grid item xs={1}>
          <Box style={{ height: "calc(100vh * 6/12)", position: "relative" }} />
          <Box
            style={{
              borderLeft: "2px solid black",
              height: "30%",
              position: "relative",
              top: "0",
            }}
          >
            <Box
              style={{
                height: "10%",
                position: "relative",
                top: "0",
              }}
            >
              <Box
                style={{
                  borderLeft: "2px solid black",
                  height: "50%",
                  position: "relative",
                  bottom: "0",
                }}
              ></Box>
            </Box>
            <Box
              style={{
                borderRight: "2px solid black",
                height: "100%",
                position: "absolute",
                right: "0",
              }}
            ></Box>
          </Box>
        </Grid>
        <Grid item xs={5} container justifyContent="center">
          <AppButton />
        </Grid>
      </ThemeProvider>
    </Grid>
  );
};

export default VerticalLine;
