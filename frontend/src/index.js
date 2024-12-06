import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import { ApplicationContextProvider } from './components/ApplicationContext';

const appDiv = document.getElementById("app")
const root = createRoot(appDiv);

root.render(
    <BrowserRouter>
        <ApplicationContextProvider>
            <App />
        </ApplicationContextProvider>
    </BrowserRouter>
)