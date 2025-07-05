import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { 
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";

// Using BrowserRouter with future flags to address warnings
const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter future={{ 
      v7_startTransition: true, 
      v7_relativeSplatPath: true 
    }}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

