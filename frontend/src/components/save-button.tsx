import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material";
import BalsamiqTheme from "../themes/theme";
import axios from "axios";
import { Box } from "../pages/home/ImgEditorPage";

interface SaveButtonProps {
  buttonName: string;
  boxes: Box[];
  selectedImgId: string | null;
}

const SaveButton = ({ buttonName, boxes, selectedImgId }: SaveButtonProps) => {
  const handleBoxesSave = async () => {
    try {
      const imgBoxes = { imgage_id: selectedImgId, boxes: boxes };
      await axios.post(
        "http://localhost:3333/api/images/save",
        imgBoxes,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("Boxes saved successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to save boxes");
    }
  };

  return (
    <ThemeProvider theme={BalsamiqTheme}>
      <Button
        onClick={handleBoxesSave}
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

export default SaveButton;
