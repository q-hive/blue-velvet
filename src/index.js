import React,{Suspense} from "react";
import { App } from "./App";
import { createRoot } from 'react-dom/client'

//Theme
import { ThemeProvider } from "@mui/material";
import { BV_THEME } from "./theme/BV-theme";

//*TRANSLATIONS FRAMEWORK
import './i18config.js'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
    <React.StrictMode>
        <Suspense fallback="loading">
            <ThemeProvider theme={BV_THEME}>
                <App/>
            </ThemeProvider>
        </Suspense>
        
    </React.StrictMode>
)