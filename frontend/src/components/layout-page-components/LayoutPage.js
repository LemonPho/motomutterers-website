import React, { useContext, useState, useEffect } from "react";

import { useApplicationContext } from "../ApplicationContext";

import Footer from "./Footer";
import Header from "./Header";
import Content from "./Content";
import { useOpenersContext } from "../OpenersContext";

function LayoutPage() {
    const { resetApplicationMessages, errorMessage, successMessage, loadingMessage, informationMessage } = useApplicationContext();
    const { closeModal, closeDropdown } = useOpenersContext();


    function handleGeneralClick(event){
        event.stopPropagation();

        closeModal();
        closeDropdown();
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
            <Header />
            <Content/>
            <Footer/>
        </div>
    );
}

export default LayoutPage;