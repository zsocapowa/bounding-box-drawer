import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material";
import BalsamiqTheme from "../themes/theme";

interface CloseButtonProps {
  buttonName: string;
  setIsHomePage: React.Dispatch<React.SetStateAction<boolean>>;
}

const CloseButton = ({ buttonName, setIsHomePage }: CloseButtonProps) => {
  const handleClick = () => {
    setIsHomePage(true);
  };
  return (
    <ThemeProvider theme={BalsamiqTheme}>
      <Button
        onClick={handleClick}
        variant="contained"
        component="label"
        size="large"
        sx={{
          textTransform: "none",
          fontSize: "1.5rem",
          boxShadow: "4px 4px 0px rgba(0,0,0,1)",
          borderRadius: 0,
          color: "black",
          backgroundColor: "white",
          border: "4px solid black",
          padding: "0px 10px", // Add padding for button size
          margin: "10px 30px 10px 0", // Top
          width: "auto", // Adjust width to fit content
          height: "auto",
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

export default CloseButton;
