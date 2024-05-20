import {
  ThemeProvider,
  ListItemText,
  List,
  ListItemButton,
} from "@mui/material";
import BalsamiqTheme from "../themes/theme";
import { FileItem } from "./vertical-line";

interface ImgListItemProps {
  id: string;
  file: FileItem | null;
  color: string;
  setSelectedImgId: React.Dispatch<React.SetStateAction<string | null>>;
}

interface ImgFilesListProps {
  files: FileItem[];
  setSelectedImgId: React.Dispatch<React.SetStateAction<string | null>>;
}

const ImgListItem = ({
  id,
  file,
  color,
  setSelectedImgId,
}: ImgListItemProps) => {
  return (
    <ListItemButton
      key={id}
      onClick={() => setSelectedImgId(file ? id : null)}
      sx={{
        backgroundColor: color,
        minWidth: "25vh",
        flexGrow: 1,
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

const ImgFilesList = ({ files, setSelectedImgId }: ImgFilesListProps) => {
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
          maxHeight: "30vh",
          overflow: "auto",
          // maxWidth: "30vh",
          height: "calc(100vh * 6/12)",
          display: "flex", // Set the List to be a flex container
          flexDirection: "column",
        }}
      >
        {files.map((file, index) => (
          <ImgListItem
            id={file.file_id}
            file={file}
            color={index % 2 === 0 ? "white" : "#DDDDDD"}
            setSelectedImgId={setSelectedImgId}
          />
        ))}
        {Array(Math.max(0, 5 - files.length))
          .fill(null)
          .map((_, index) => (
            <ImgListItem
              id={(index + files.length).toString()}
              file={null}
              color={(index + files.length) % 2 === 0 ? "white" : "#DDDDDD"}
              setSelectedImgId={setSelectedImgId}
            />
          ))}
      </List>
    </ThemeProvider>
  );
};

export default ImgFilesList;
