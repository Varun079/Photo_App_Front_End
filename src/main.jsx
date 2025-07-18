import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./contexts/appContext.jsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AppContextProvider>
            <App />
            <ToastContainer />
        </AppContextProvider>
    </StrictMode>
);
