import React, { useState, useEffect } from "react";

import { toggleDropdown } from "../utils";

import ProfilePictureLazyLoader from "../util-components/ProfilePictureLazyLoader";
import { useStandingsContext } from "./StandingsContext";
import StandingDetailed from "./StandingDetailed";
import { Link, useLocation } from "react-router-dom";
import { useApplicationContext } from "../ApplicationContext";

export default function Standings(){
    const { user, userLoading } = useApplicationContext();
    const { 
        retrieveStandings, retrieveSelectedSeason, retrieveSeasonList, selectedSeason, seasonList,
        standings, standingsLoading, selectedSeasonLoading, seasonListLoading, profilePicturesLoading, retrieveUserPicks,
        copyStandingsTable } = useStandingsContext();

    const location = useLocation();

    async function fetchData(){
        await retrieveStandings();
        await retrieveSeasonList();
        await retrieveSelectedSeason();
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        fetchData();
    }, [location.search])



    return (
    <div className="card rounded-15 align-middle element-background-color element-border-color">
        <div className="rounded-15-top card-header">
            <div className="d-flex align-items-center">
                <h5 className="m-0">
                    <span>Standings</span>
                </h5>
                {!selectedSeasonLoading && selectedSeason.finalized &&
                    <small>‎ (finalized)</small>
                }
                <div className="ms-auto btn-group">
                    <button className="btn btn-outline-secondary dropdown-toggle rounded-15" data-bs-toggle="dropdown" type="button" aria-expanded="false" onClick={(e) => {toggleDropdown("season-selector-dropdown", e)}}>
                        {selectedSeason.year}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" id="season-selector-dropdown" style={{top: "100%", right: "0"}}>
                    {!seasonListLoading && seasonList.map((season) => (
                        <li key={`${season.year}`}>
                            <Link className="dropdown-item" to={`?season=${season.year}`} id={`${season.year}`}>
                                {season.year}
                                {season.year == selectedSeason.year && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ms-auto me-1 bi bi-check" viewBox="0 0 16 16">
                                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                                    </svg>
                                )}
                            </Link>
                        </li>
                    ))}
                    </ul>
                </div>
                {(!userLoading && user.is_admin) && 
                    <div className="dropdown-div ms-2" onClick={(e) => toggleDropdown(`dropdown-standings-options`, e)}>
                        <div className="d-flex align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                            </svg>
                        </div>
                        <ul id={`dropdown-standings-options`} className="dropdown-menu">
                            <li><button className="dropdown-item" onClick={() => copyStandingsTable()}>Copy Standings Table</button></li>
                        </ul>
                    </div>
                }
            </div>
        </div>
        <div className="card-body">
            {(!standingsLoading && (!standings || standings.users_picks.length == 0)) ? 
            (<div>There are no standings for this season</div>) : 
            (standingsLoading == 0 && standings.users_picks.map((user_picks, i) => (
                <div key={`standings-user-${user_picks.user.username}`}>
                    <div className="p-2 clickable rounded-15" onClick={(e) => {e.stopPropagation(); toggleModal("user-picks-detailed-modal", e); retrieveUserPicks(user_picks.user.id)}}>
                        <div className="d-flex align-items-center">
                            <ProfilePictureLazyLoader width="3.5rem" height="3.5rem" username={user_picks.user.username}/>
                            <div className="ms-1"><strong>{i+1}. {user_picks.user.username} - {user_picks.points}</strong></div>
                        </div>
                        <div className="d-flex align-items-center">
                            {user_picks.picks.map((pick) => (
                                <div className="me-1" style={{fontSize: "0.75rem"}} key={`user-${user_picks.user.id}-pick-${pick.competitor_id}`}><strong>{pick.first[0]}. {pick.last.slice(0,3)}</strong> - {pick.points}</div>
                            ))}

                            {!selectedSeasonLoading && selectedSeason.top_independent && <div className="me-1" style={{fontSize: "0.75rem"}}><strong>| I: {user_picks.independent_pick.first[0]}. {user_picks.independent_pick.last.slice(0,3)}</strong> - {user_picks.independent_pick.points}</div>}
                            {!selectedSeasonLoading && selectedSeason.top_rookie && <div className="me-1" style={{fontSize: "0.75rem"}}><strong>| R: {user_picks.rookie_pick.first[0]}. {user_picks.rookie_pick.last.slice(0,3)}</strong> - {user_picks.rookie_pick.points}</div>}
                            
                        </div>
                    </div>
                    <hr />
                </div>
                
            )))}
        </div>
        <StandingDetailed />
    </div>);
}