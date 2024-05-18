import { ThemeProvider, ListItemText, List, ListItem, ListItemButton} from "@mui/material";
import BalsamiqTheme from "../themes/theme";
import { FileItem } from "./vertical-line";

interface ImgListItemProps {
  file: FileItem | null;
  color: string;
}

interface ImgFilesListProps {
  files: FileItem[];
}

const ImgListItem = ({ file, color }: ImgListItemProps) => {
  return (
    <ListItemButton
      key={file?.file_id}
      onClick={() => (console.log("ssss"))}
      sx={{
        backgroundColor: color,
        maxHeight: "5vh",
        minWidth: "25vh",
        display: "flex", // Ensure the ListItem is a flex container
        alignItems: "center", // Vertically center the content
        justifyContent: "center", // Horizontally center the content
      }}
    >
      <ListItemText primary={file?.file_name} />
    </ListItemButton>
  );
};

const ImgFilesList = ({ files }: ImgFilesListProps) => {
  console.log("dddddddddddd", files);
  return (
    <ThemeProvider theme={BalsamiqTheme}>
      <List
        sx={{
          borderStyle: "solid",
          borderWidth: "4px",
          borderColor: "black",
          paddingTop: 0,
          paddingBottom: 0,
          marginTop: 1,
          marginBottom: 2,
          maxHeight: "25vh",
          overflow: "auto",
          maxWidth: "30vh",
        }}
      >
        {files.map((file, index) => (
          <ImgListItem
            key={index}
            file={file}
            color={index % 2 === 0 ? "white" : "#DDDDDD"}
          />
        ))}
        {Array(Math.max(0, 5 - files.length))
          .fill(null)
          .map((_, index) => (
            <ImgListItem
              key={index + files.length}
              file={null}
              color={(index + files.length) % 2 === 0 ? "white" : "#DDDDDD"}
            />
          ))}
      </List>
    </ThemeProvider>
  );
};

export default ImgFilesList;
