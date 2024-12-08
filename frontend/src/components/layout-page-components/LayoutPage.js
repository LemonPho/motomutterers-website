import React, { useContext, useState, useEffect } from "react";
import { getScreenDimensions, closeDropdowns, closeModals, toggleDropdown } from "../utils";

import { useApplicationContext } from "../ApplicationContext";

import Footer from "./Footer";
import Header from "./Header";
import Content from "./Content";

function LayoutPage() {
    const { resetApplicationMessages } = useApplicationContext();

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
            <Content/>
            <Footer/>
        </div>
    );
}

export default LayoutPage;