import React, { useContext, useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { getScreenDimensions, closeDropdowns, closeModals, toggleDropdown } from "../utils";

import { useApplicationContext } from "../ApplicationContext";
import NotificationsDropdown from "./NotificationsDropdown";
import UserDropdown from "./UserDropdown";

function LayoutPage() {
    const { currentSeason, errorMessage, successMessage, contextLoading, loadingMessage, selectPicksState, loggedIn, setSuccessMessage, resetApplicationMessages } = useApplicationContext();

    const [screenWidth, setScreenWidth] = useState(getScreenDimensions().width);

    function handleGeneralClick(event){
        event.stopPropagation();

        closeModals();
        closeDropdowns();
        resetApplicationMessages();

        return;
    }

    useEffect(() => {
        const handleWidthResize = () => {
            setScreenWidth(getScreenDimensions().width);
        };
        window.addEventListener("resize", handleWidthResize);
        return(() => {
            window.removeEventListener("resize", handleWidthResize);
        })
    }, [screenWidth]);

    useEffect(() => {
        resetApplicationMessages();
    }, [])

    return(
        <div id="main-div" className="dynamic-container" onClick={(e) => handleGeneralClick(e)}>
            
            <div id="background-blur" className="overlay hidden"></div>
            <div className=" menu-div d-flex">
                {screenWidth < 500 ? 
                (
                <div className="menu-dropdown-div">
                    <div id="menu-dropdown-button" onClick={(e) => toggleDropdown("menu-dropdown-content", e)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24" fill="none">
                            <path d="M4 6H20M4 12H20M4 18H20" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <a href="/" className="navbar-brand link-no-decorations my-1 ms-1">Home</a>
                    </div>
                    <div id="menu-dropdown-content" className="menu-dropdown-content">
                        <div>
                            {!currentSeason && <span className="navbar-text w-100">No current season</span>}
                            {currentSeason && <a href={`/raceresults?season=${currentSeason.year}`} className="navbar-text link-no-decorations w-100">Races</a> }       
                        </div>
                        <div>
                            <a href="/announcements?page=1" className="navbar-text link-no-decorations w-100">Announcements</a>
                        </div>
                        <div>
                            {currentSeason && <a href={`/standings?season=${currentSeason.year}`} className="navbar-text link-no-decorations w-100">Standings</a>}
                            
                        </div>
                        <div>
                            {selectPicksState && loggedIn && <a href="/select-picks" className="navbar-text link-no-decorations w-100">Select your picks!</a>}
                        </div>
                    </div>
                </div>) 
                : 
                (<div className="d-flex align-items-center">
                    <a href="/" className="menu-bar-title link-no-decorations" style={{marginLeft: "2rem"}}>Home</a>   
                    {!currentSeason && <span className="menu-bar-item ps-2">No current season</span>}
                    {currentSeason && <a href={`/raceresults?season=${currentSeason.year}`} className="menu-bar-item link-no-decorations ps-2">Races</a>}
                    <a href="/announcements?page=1" className="menu-bar-item link-no-decorations ps-2">Announcements</a>
                    {currentSeason && <a href={`/standings?season=${currentSeason.year}`} className="menu-bar-item link-no-decorations ps-2">Standings</a>}
                    {selectPicksState && loggedIn &&
                        <a href="/select-picks" className="menu-bar-item link-no-decorations d-flex align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="rgb(0, 118, 255)" className="bi bi-dot" viewBox="0 0 16 16">
                                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                            </svg>
                            <div>
                                Select your picks!
                            </div>
                            
                        </a>}
                </div>)
                }
                <div className="d-flex align-items-center ms-auto">
                    <div className="menu-bar-item"><NotificationsDropdown /></div>
                    <div className="menu-bar-item" style={{marginRight: "2rem"}}><UserDropdown /></div>
                </div>
            </div>
            <div className="dynamic-container" style={{maxWidth: "10in", paddingLeft: "0.5rem", paddingRight: "0.5rem"}}>
                {errorMessage && <div className="alert alert-danger my-2" style={{whiteSpace: "pre-line"}}>{errorMessage}</div>}
                {successMessage && <div className="alert alert-success my-2" style={{whiteSpace: "pre-line"}}>{successMessage}</div>}
                {loadingMessage && <div className="alert alert-secondary my-2" style={{whiteSpace: "pre-line"}}>{loadingMessage}</div>}
                <Outlet />
            </div>
        </div>
    );
}

export default LayoutPage;