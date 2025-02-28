import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import { ApplicationContextProvider } from './components/ApplicationContext';
import { OpenersContextProvider } from './components/OpenersContext';

const appDiv = document.getElementById("app")
const root = createRoot(appDiv);

root.render(
    <BrowserRouter>
        <ApplicationContextProvider>
            <OpenersContextProvider>
                <App />
            </OpenersContextProvider>
        </ApplicationContextProvider>
    </BrowserRouter>
)