import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import { ApplicationContextProvider } from './components/ApplicationContext';
import { ModalsContextProvider } from './components/ModalsContext';

const appDiv = document.getElementById("app")
const root = createRoot(appDiv);

root.render(
    <BrowserRouter>
        <ApplicationContextProvider>
            <ModalsContextProvider>
                <App />
            </ModalsContextProvider>
        </ApplicationContextProvider>
    </BrowserRouter>
)