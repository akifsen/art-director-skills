import React from "react";
import { createRoot } from "react-dom/client";
import DeskScreen from "./DeskScreen.jsx";
import "./theme.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DeskScreen />
  </React.StrictMode>
);
