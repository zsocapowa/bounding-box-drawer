import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material";
import BalsamiqTheme from "../themes/theme";
import axios from "axios";
import { Box } from "../pages/home/ImgEditorPage";

interface LoadButtonProps {
  buttonName: string;
  selectedImgId: string | null;
  setIsHomePage: React.Dispatch<React.SetStateAction<boolean>>;
  setBoxes: React.Dispatch<React.SetStateAction<Box[]>>;
  setPresignedUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

const LoadButton = ({
  buttonName,
  selectedImgId,
  setIsHomePage,
  setBoxes,
  setPresignedUrl,
}: LoadButtonProps) => {
  const handleClick = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3333/api/images/load?img_id=${selectedImgId}`
      );
      setPresignedUrl(response.data.url);
      setBoxes(response.data.img_boxes)
      setIsHomePage(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to load image");
    }
  };

  return (
    <ThemeProvider theme={BalsamiqTheme}>
      <Button
        disabled={selectedImgId === null}
        onClick={handleClick}
        variant="contained"
        component="label"
        sx={{
          padding: "0px 10px", // Add padding for button size
          textTransform: "none",
          boxShadow: "4px 4px 0px rgba(0,0,0,1)",
          fontSize: "1.5rem",
          borderRadius: 0,
          color: "black",
          backgroundColor: "white",
          border: "4px solid black",
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
