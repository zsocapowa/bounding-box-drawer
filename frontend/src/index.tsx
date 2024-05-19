import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import HomePage from "./pages/home/HomePage";
import DrawingPage from "./pages/home/ImgEditorPage";

const App = () => {
  const [isHomePage, setIsHomePage] = useState(true);

  return (
    <React.StrictMode>
      {isHomePage ? (
        <HomePage setIsHomePage={setIsHomePage} />
      ) : (
        <DrawingPage />
      )}
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);

reportWebVitals();
