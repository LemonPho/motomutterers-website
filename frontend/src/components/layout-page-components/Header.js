import React, { useState, useEffect } from "react";

import { useApplicationContext } from "../ApplicationContext";
import { getScreenDimensions, closeDropdowns, closeModals, toggleDropdown } from "../utils";

import NotificationsDropdown from "./NotificationsDropdown";
import UserDropdown from "./UserDropdown";

export default function Header(){
    const { currentSeason, selectPicksState, user, userLoading, contextLoading, currentSeasonLoading, selectPicksStateLoading } = useApplicationContext();

    const [screenWidth, setScreenWidth] = useState(getScreenDimensions().width);

    useEffect(() => {
        const handleWidthResize = () => {
            setScreenWidth(getScreenDimensions().width);
        };
        window.addEventListener("resize", handleWidthResize);
        return(() => {
            window.removeEventListener("resize", handleWidthResize);
        })
    }, [screenWidth]);

    if(screenWidth < 500){
        return(
            <div className="header menu-div d-flex align-items-center">
                {screenWidth < 500 && !contextLoading &&
                <div className="btn-group d-flex align-items-center">
                    <button className="btn btn-link link-no-decorations" onClick={(e) => toggleDropdown("menu-dropdown-content", e)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24" fill="none">
                            <path d="M4 6H20M4 12H20M4 18H20" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <a href="/" className="navbar-brand link-no-decorations my-1 ms-1">Home</a>
                    <div id="menu-dropdown-content" className="dropdown-menu" style={{top: "100%", left: "0"}}>
                        {(!currentSeasonLoading && !currentSeason) && <span className="navbar-text dropdown-item">No current season</span>}
                        {(!currentSeasonLoading && currentSeason) && <a href={`/raceresults?season=${currentSeason.year}`} className="navbar-text dropdown-item">Races</a> }       
                        <a href="/announcements?page=1" className="navbar-text dropdown-item">Announcements</a>
                        {(!currentSeasonLoading && currentSeason) && <a href={`/standings?season=${currentSeason.year}`} className="navbar-text dropdown-item">Standings</a>}
                        {(!selectPicksStateLoading && selectPicksState && !userLoading && user.is_logged_in) && <a href="/select-picks" className="navbar-text dropdown-item">Select your picks!</a>}
                    </div>
                </div>}
                <div className="d-flex align-items-center ms-auto">
                    <div className="menu-bar-item"><NotificationsDropdown /></div>
                    <div className="menu-bar-item" style={{marginRight: "2rem"}}><UserDropdown /></div>
                </div>
            </div>
        );
    }

    //here it is being assumed that there is a current season, which in the vast majority of time its true, this is to avoid a bunch
    //of movement as the top bar stuff loads
    if(currentSeasonLoading){
        return(
            <div className="header menu-div d-flex align-items-center">
                <div className="d-flex align-items-center">
                    <a href="/" className="menu-bar-title link-no-decorations" style={{marginLeft: "2rem"}}>Home</a>
                    <span className="menu-bar-item link-no-decorations ps-2">Races</span>
                    <a href="/announcements?page=1" className="menu-bar-item link-no-decorations ps-2">Announcements</a>
                    <span className="menu-bar-item link-no-decorations ps-2">Standings</span>
                </div>
                <div className="d-flex align-items-center ms-auto">
                    <div className="menu-bar-item"><NotificationsDropdown /></div>
                    <div className="menu-bar-item" style={{marginRight: "2rem"}}><UserDropdown /></div>
                </div>
            </div>
        );
    } else {
        return(
            <div className="header menu-div d-flex align-items-center">
                <div className="d-flex align-items-center">
                    <a href="/" className="menu-bar-title link-no-decorations" style={{marginLeft: "2rem"}}>Home</a>
                    {(!currentSeasonLoading && !currentSeason) && <span className="menu-bar-item ps-2">No current season</span>}
                    {(!currentSeasonLoading && currentSeason) && <a href={`/raceresults?season=${currentSeason.year}`} className="menu-bar-item link-no-decorations ps-2">Races</a>}
                    <a href="/announcements?page=1" className="menu-bar-item link-no-decorations ps-2">Announcements</a>
                    {(!currentSeasonLoading && currentSeason) && <a href={`/standings?season=${currentSeason.year}`} className="menu-bar-item link-no-decorations ps-2">Standings</a>}
                    {(!selectPicksStateLoading && selectPicksState && !userLoading && user.is_logged_in) &&
                        <a href="/select-picks" className="menu-bar-item link-no-decorations d-flex align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="rgb(0, 118, 255)" className="bi bi-dot" viewBox="0 0 16 16">
                                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                            </svg>
                            <div>
                                Select your picks!
                            </div>
                        </a>}
                </div>
                <div className="d-flex align-items-center ms-auto">
                    <div className="menu-bar-item"><NotificationsDropdown /></div>
                    <div className="menu-bar-item" style={{marginRight: "2rem"}}><UserDropdown /></div>
                </div>
            </div>             
        );
    }
}