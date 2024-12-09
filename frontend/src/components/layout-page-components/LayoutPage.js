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
                {errorMessage && <div className="alert alert-danger my-2" style={{whiteSpace: "pre-line"}}>{errorMessage}</div>}
                {successMessage && <div className="alert alert-success my-2" style={{whiteSpace: "pre-line"}}>{successMessage}</div>}
                {loadingMessage && <div className="alert alert-secondary my-2" style={{whiteSpace: "pre-line"}}>{loadingMessage}</div>}
                {informationMessage && <div className="alert alert-information my-2" style={{whiteSpace: "pre-line"}}>{informationMessage}</div>}
                <Content/>
            </div>
            <Footer/>
        </div>
    );
}

export default LayoutPage;