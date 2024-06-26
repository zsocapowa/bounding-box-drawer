import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material";
import BalsamiqTheme from "../themes/theme";
import axios from "axios";
import { FileItem } from "./vertical-line";

interface UploadButtonProps {
  buttonName: string;
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
}

const UploadButton = ({ buttonName, setFiles }: UploadButtonProps) => {
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      try {
        const formData = new FormData();
        formData.append("image", file);

        // TODO: put endpoint call to env
        const response = await axios.post(
          "http://localhost:3333/api/images/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const newFileItem: FileItem = {
          file_id: response.data.file_id,
          file_name: response.data.file_name,
        };

        setFiles((prevFiles: FileItem[]) => [...prevFiles, newFileItem]);

        alert("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image");
      }
    }
  };

  return (
    <ThemeProvider theme={BalsamiqTheme}>
      <Button
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
        <input
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Button>
    </ThemeProvider>
  );
};

export default UploadButton;
