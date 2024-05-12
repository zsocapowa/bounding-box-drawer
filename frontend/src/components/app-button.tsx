import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material";
import BalsamiqTheme from "../themes/theme";

const AppButton = () => {
  return (
      <ThemeProvider theme={BalsamiqTheme}>
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            boxShadow: "4px 4px 0px rgba(0,0,0,1)",
            borderRadius: 0,
            color: "black",
            backgroundColor: "white",
            border: "3px solid black",
            width: "40%",
            height: "6%",
            "&:hover": {
              backgroundColor: "#C3C3C3",
              boxShadow: "4px 4px 0px rgba(0,0,0,1)",
            },
          }}
        >
          Open Image
        </Button>
      </ThemeProvider>
  );
};

export default AppButton;
