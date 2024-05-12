import { ThemeProvider, ListItemText, List, ListItem } from "@mui/material";
import BalsamiqTheme from "../themes/theme";

interface ImgListItemProps {
  fileName: string | null;
  color: string;
}

interface ImgFilesListProps {
  fileNames: string[];
}

const ImgListItem = ({ fileName, color }: ImgListItemProps) => {
  return (
    <ListItem
      sx={{
        backgroundColor: color,
      }}
    >
      <ListItemText primary={fileName || "\u00A0"} />
    </ListItem>
  );
};

const ImgFilesList = ({ fileNames }: ImgFilesListProps) => {
  const items =
    fileNames.length < 5
      ? new Array(5).fill(null).map((_, index) => fileNames[index] || null)
      : fileNames;
  return (
    <ThemeProvider theme={BalsamiqTheme}>
      <List
        sx={{
          borderStyle: "solid",
          borderWidth: "4px",
          borderColor: "black",
          paddingTop: 0,
          paddingBottom: 0,
          maxHeight: "45vh",
          overflow: "auto",
        }}
      >
        {items.map((file, index) => (
          <ImgListItem
            key={index}
            fileName={file}
            color={index % 2 === 0 ? "white" : "#DDDDDD"}
          />
        ))}
      </List>
    </ThemeProvider>
  );
};

export default ImgFilesList;
