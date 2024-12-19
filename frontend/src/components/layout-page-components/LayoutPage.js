import React, { useContext, useState, useEffect } from "react";
import { getScreenDimensions, closeDropdowns, closeModals, toggleDropdown } from "../utils";

import { useApplicationContext } from "../ApplicationContext";

import Footer from "./Footer";
import Header from "./Header";
import Content from "./Content";

function LayoutPage() {
    const { resetApplicationMessages, errorMessage, successMessage, loadingMessage, informationMessage } = useApplicationContext();

    function handleGeneralClick(event){
        event.stopPropagation();

        closeModals();
        closeDropdowns();
        resetApplicationMessages();

        return;
    }

    useEffect(() => {
        resetApplicationMessages();
    }, [])

    return(
        <div id="main-div" className="main" onClick={(e) => handleGeneralClick(e)}>
            
            <div id="background-blur" className="overlay hidden"></div>
            <Header />
            <div className="content">
                {errorMessage && <div className="alert alert-danger my-2 alert-positioning d-flex align-items-center" style={{whiteSpace: "pre-line"}}>{errorMessage}<button className="ms-auto btn btn-link link-no-decorations p-0"><h4 aria-hidden="true">&times;</h4></button></div>}
                {successMessage && <div className="alert alert-success my-2 alert-positioning d-flex align-items-center" style={{whiteSpace: "pre-line"}}>{successMessage}<button className="ms-auto btn btn-link link-no-decorations p-0"><h4 aria-hidden="true">&times;</h4></button></div>}
                {loadingMessage && <div className="alert alert-secondary my-2 alert-positioning d-flex align-items-center" style={{whiteSpace: "pre-line"}}>{loadingMessage}<button className="ms-auto btn btn-link link-no-decorations p-0"><h4 aria-hidden="true">&times;</h4></button></div>}
                {informationMessage && <div className="alert alert-information my-2 alert-positioning d-flex align-items-center" style={{whiteSpace: "pre-line"}}>{informationMessage}<button className="ms-auto btn btn-link link-no-decorations p-0"><h4 aria-hidden="true">&times;</h4></button></div>}
                <Content/>
            </div>
            <Footer/>
        </div>
    );
}

export default LayoutPage;