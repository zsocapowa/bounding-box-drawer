import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material";
import BalsamiqTheme from "../themes/theme";
import axios from "axios";

interface LoadButtonProps {
  buttonName: string;
  setIsHomePage: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoadButton = ({ buttonName, setIsHomePage }: LoadButtonProps) => {
  const handleClick = () => {
    setIsHomePage(false);
  };
  return (
    <ThemeProvider theme={BalsamiqTheme}>
      <Button
        onClick={handleClick}
        variant="contained"
        component="label"
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
        {buttonName}
      </Button>
    </ThemeProvider>
  );
};

export default LoadButton;
