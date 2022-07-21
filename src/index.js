import React from "react";
import { App } from "./App";
import { createRoot } from 'react-dom/client'

//Theme
import { ThemeProvider } from "@mui/material";
import { BV_THEME } from "./theme/BV-theme";

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
    <React.StrictMode>
        <ThemeProvider theme={BV_THEME}>
        <App/>
        </ThemeProvider>
    </React.StrictMode>
)