import { ThemeProvider } from "@mui/material";
import BalsamiqTheme from "../../themes/theme";
import DrawingApp from "../../components/img-drawing";

const DrawingPage = () => {
  return (
    <ThemeProvider theme={BalsamiqTheme}>
      <DrawingApp />
    </ThemeProvider>
  );
};

export default DrawingPage;
