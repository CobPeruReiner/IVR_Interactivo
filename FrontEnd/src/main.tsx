import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { AuthProvider } from "./Provider/AuthProvider";
import { CampanasProvider } from "./Provider/CampanasProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <CampanasProvider>
        <App />
      </CampanasProvider>
    </AuthProvider>
  </StrictMode>
);
