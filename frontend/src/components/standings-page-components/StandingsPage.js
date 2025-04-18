import React, { useState, useEffect } from "react";

import { useStandingsContext } from "./StandingsContext";
import StandingDetailed from "./StandingDetailed";
import { Link, useLocation } from "react-router-dom";
import { useApplicationContext } from "../ApplicationContext";
import Modal from "../util-components/Modal";
import { useOpenersContext } from "../OpenersContext";
import Dropdown from "../util-components/Dropdown";
import Standing from "./Standing";

export default function Standings(){
    const { user, userLoading } = useApplicationContext();
    const { selectedSeason, seasonList, standings, standingsLoading, seasonListLoading, retrieveUserPicks, copyStandingsTable } = useStandingsContext();
    const { openedModal, openModal, openedDropdown, toggleDropdown, closeDropdown } = useOpenersContext();

    return (
    <div className="card rounded-15 align-middle element-background-color element-border-color p-2">
        <div className="rounded-15-top card-header rounded-15 nested-element-color mb-3">
            <div className="d-flex align-items-center">
                <h5 className="m-0">
                    <span>Standings</span>
                </h5>
                <div className="ms-auto btn-group dropdown-div">
                    <button className="btn btn-outline-secondary dropdown-toggle rounded-15" data-bs-toggle="dropdown" type="button" aria-expanded="false" onClick={(e) => {toggleDropdown("season-selector-dropdown", e)}}>
                        {selectedSeason}
                    </button>
                    <Dropdown isOpen={openedDropdown == "season-selector-dropdown"}>
                        <ul className="dropdown-menu" id="season-selector-dropdown" style={{top: "100%", right: "0"}}>
                        {!seasonListLoading && seasonList.map((season) => (
                            <li key={`${season.year}`}>
                                <Link className="dropdown-item" onClick={closeDropdown} to={`?season=${season.year}`} id={`${season.year}`}>
                                    {season.year}
                                    {season.year == selectedSeason && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ms-auto me-1 bi bi-check" viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                                        </svg>
                                    )}
                                </Link>
                            </li>
                        ))}
                        </ul>
                    </Dropdown>
                </div>
                {(!userLoading && user.is_admin) && 
                    <div className="dropdown-div ms-2" onClick={(e) => toggleDropdown(`dropdown-standings-options`, e)}>
                        <div className="d-flex align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                            </svg>
                        </div>
                        <Dropdown isOpen={openedDropdown == "dropdown-standings-options"}>
                            <ul id={`dropdown-standings-options`} className="dropdown-menu">
                                <li><button className="dropdown-item" onClick={() => copyStandingsTable()}>Copy Standings Table</button></li>
                            </ul>
                        </Dropdown>
                    </div>
                }
            </div>
        </div>
        <div className="card-body p-0">
            {(!standingsLoading && (!standings || standings.users_picks.length == 0)) ? 
            (<div className="p-2">There are no standings for this season</div>) : 
            (standingsLoading == 0 && standings.users_picks.map((userPicks, i) => (
                <div key={`standings-user-${userPicks.user.username}`} className="clickable mb-1 rounded-15" onClick={(e) => {e.stopPropagation(); openModal("standing-detailed"); retrieveUserPicks(userPicks.user.username)}}>
                    <Standing userPicks={userPicks} i={i} small={false}/>
                </div>                
            )))}
        </div>
        <Modal isOpen={openedModal == "standing-detailed"}>
            <StandingDetailed />
        </Modal>
    </div>);
}