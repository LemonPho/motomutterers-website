import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import { ApplicationContextProvider } from './components/ApplicationContext';
import { OpenersContextProvider } from './components/OpenersContext';
import { ImagesContextProvider } from './components/ImagesContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../static/css/index.css'; 

const appDiv = document.getElementById("app")
const root = createRoot(appDiv);

root.render(
    <BrowserRouter>
        <ApplicationContextProvider>
            <ImagesContextProvider>
                <OpenersContextProvider>
                    <App />
                </OpenersContextProvider>
            </ImagesContextProvider>
        </ApplicationContextProvider>
    </BrowserRouter>
)