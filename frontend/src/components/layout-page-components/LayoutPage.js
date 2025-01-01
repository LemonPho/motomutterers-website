import React, { useContext, useState, useEffect } from "react";
import { getScreenDimensions, closeDropdowns, closeModals, toggleDropdown } from "../utils";

import { useApplicationContext } from "../ApplicationContext";

import Footer from "./Footer";
import Header from "./Header";
import Content from "./Content";
import { useLocation } from "react-router-dom";

function LayoutPage() {
    const { resetApplicationMessages, errorMessage, successMessage, loadingMessage, informationMessage } = useApplicationContext();
    const location = useLocation();


    function handleGeneralClick(event){
        event.stopPropagation();

        closeModals();
        closeDropdowns();
        resetApplicationMessages();

        return;
    }

    return(
        <div id="main-div" className="main" onClick={(e) => handleGeneralClick(e)}>
            <div className="alert-container">
                {errorMessage && 
                <div className="alert alert-danger my-2 alert-positioning d-flex align-items-center" style={{whiteSpace: "pre-line"}} onClick={(e) => {e.stopPropagation();resetApplicationMessages();}}>
                    {errorMessage}
                    <button className="ms-auto btn btn-link link-no-decorations p-0">
                        <h4 aria-hidden="true">&times;</h4>
                    </button>
                </div>
                }
                {successMessage && 
                <div className="alert alert-success my-2 alert-positioning d-flex align-items-center" style={{whiteSpace: "pre-line"}} onClick={(e) => {e.stopPropagation();resetApplicationMessages();}}>
                    {successMessage}
                    <button className="ms-auto btn btn-link link-no-decorations p-0">
                        <h4 aria-hidden="true">&times;</h4>
                    </button>
                </div>
                }
                {loadingMessage && 
                <div className="alert alert-secondary my-2 alert-positioning d-flex align-items-center" style={{whiteSpace: "pre-line"}} onClick={(e) => {e.stopPropagation();resetApplicationMessages();}}>
                    {loadingMessage}
                    <button className="ms-auto btn btn-link link-no-decorations p-0">
                        <h4 aria-hidden="true">&times;</h4>
                    </button>
                </div>
                }
            </div>
            <div id="background-blur" className="overlay hidden"></div>
            <Header />
            <Content/>
            <Footer/>
        </div>
    );
}

export default LayoutPage;