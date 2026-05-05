import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { ApplicationsProvider } from "./app/lib/applications-store";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <ApplicationsProvider>
    <App />
  </ApplicationsProvider>
);
