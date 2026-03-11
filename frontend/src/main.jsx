import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LangProvider } from "./utils/langContext";
import App from "./App";
import "./volt.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>
);