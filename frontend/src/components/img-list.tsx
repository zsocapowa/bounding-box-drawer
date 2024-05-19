import {
  ThemeProvider,
  ListItemText,
  List,
  ListItemButton,
} from "@mui/material";
import BalsamiqTheme from "../themes/theme";
import { FileItem } from "./vertical-line";

interface ImgListItemProps {
  key: string;
  file: FileItem | null;
  color: string;
}

interface ImgFilesListProps {
  files: FileItem[];
}

const ImgListItem = ({ key, file, color }: ImgListItemProps) => {
  return (
    <ListItemButton
      key={key}
      onClick={() => console.log("ssss")}
      sx={{
        backgroundColor: color,
        maxHeight: "5vh",
        minWidth: "25vh",
        display: "flex", // Ensure the ListItem is a flex container
        alignItems: "center", // Vertically center the content
        justifyContent: "center", // Horizontally center the content
      }}
    >
      <ListItemText
        primary={file?.file_name}
        primaryTypographyProps={{
          noWrap: true, // Prevent wrapping of text
          overflow: "hidden", // Hide overflow
          textOverflow: "ellipsis", // Show ellipsis (...) for overflowed content
          whiteSpace: "nowrap", // Keep the text in a single line
        }}
      />
    </ListItemButton>
  );
};

const ImgFilesList = ({ files }: ImgFilesListProps) => {
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
            key={file.file_id}
            file={file}
            color={index % 2 === 0 ? "white" : "#DDDDDD"}
          />
        ))}
        {Array(Math.max(0, 5 - files.length))
          .fill(null)
          .map((_, index) => (
            <ImgListItem
              key={(index + files.length).toString()}
              file={null}
              color={(index + files.length) % 2 === 0 ? "white" : "#DDDDDD"}
            />
          ))}
      </List>
    </ThemeProvider>
  );
};

export default ImgFilesList;
