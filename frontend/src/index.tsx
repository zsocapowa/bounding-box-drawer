import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import HomePage from "./pages/home/HomePage";
import DrawingPage from "./pages/home/ImgEditorPage";
import { Box } from "./pages/home/ImgEditorPage";

const App = () => {
  const [isHomePage, setIsHomePage] = useState(true);
  const [selectedImgId, setSelectedImgId] = useState<string | null>(null);
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);

  return (
    <React.StrictMode>
      {isHomePage ? (
        <HomePage
          setIsHomePage={setIsHomePage}
          selectedImgId={selectedImgId}
          setSelectedImgId={setSelectedImgId}
          setBoxes={setBoxes}
          setPresignedUrl={setPresignedUrl}
        />
      ) : (
        <DrawingPage
          setIsHomePage={setIsHomePage}
          selectedImgId={selectedImgId}
          boxes={boxes}
          setBoxes={setBoxes}
          presignedUrl={presignedUrl}
        />
      )}
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);

reportWebVitals();
