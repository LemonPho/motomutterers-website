import React, { useState, useEffect } from "react";

import { toggleDropdown, toggleModal } from "../utils";

import ProfilePictureLazyLoader from "../util-components/ProfilePictureLazyLoader";
import { useStandingsContext } from "./StandingsContext";
import StandingDetailed from "./StandingDetailed";

export default function Standings(){
    const { 
        retrieveStandings, retrieveSelectedSeason, retrieveSeasonList, retrieveProfilePictures, selectedSeason, seasonList,
        standings, standingsLoading, selectedSeasonLoading, seasonListLoading, profilePicturesLoading, retrieveUserPicks } = useStandingsContext();

    useEffect(() => {
        async function fetchData(){
            await retrieveStandings();
            await retrieveSeasonList();
            await retrieveSelectedSeason();
        }

        fetchData();
    }, [])

    useEffect(() => {
        async function profilePictures(){
            await retrieveProfilePictures();
        }

        profilePictures();
    }, [standingsLoading])

    return (
    <div className="card rounded-15 my-2 mt-4 align-middle">
        <div className="rounded-15-top card-header">
            <div className="d-flex align-items-center">
                <h5 className="m-0">
                    Standings
                </h5>
                {!selectedSeasonLoading && selectedSeason.finalized &&
                    <small>‎ (finalized)</small>
                }
                <div className="ms-auto dropdown">
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" onClick={(e) => {toggleDropdown("season-selector-dropdown", e)}}>
                        {selectedSeason.year}
                    </button>
                    <ul className="dropdown-menu" id="season-selector-dropdown">
                    {!seasonListLoading && seasonList.map((season) => (
                        <li className="ms-2" key={`${season.year}`}>
                            <a className="d-flex align-items-center" href={`/standings?season=${season.year}`} id={`${season.year}`}>
                                {season.year}
                                {season.year == selectedSeason.year && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ms-auto me-1 bi bi-check" viewBox="0 0 16 16">
                                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                                    </svg>
                                )}
                            </a>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        </div>
        <div className="card-body">
            {!standings ? 
            (<div>There are no standings for this season</div>) : 
            (!standingsLoading && standings.map((standing, i) => (
                <div key={`standings-user-${standing.user.username}`}>
                    <div className="p-2 clickable rounded-15" onClick={(e) => {e.stopPropagation(); toggleModal("user-picks-detailed-modal", e); retrieveUserPicks(standing.user.id)}}>
                        <div className="d-flex align-items-center">
                            {profilePicturesLoading && <ProfilePictureLazyLoader width="3.5rem" height="3.5rem" format={false} base64={false}/>}
                            {!profilePicturesLoading && <ProfilePictureLazyLoader width="3.5rem" height="3.5rem" format={standing.user.profile_picture.profile_picture_format} base64={standing.user.profile_picture.profile_picture_data}/>}
                            <div className="ms-1"><strong>{i+1}. {standing.user.username} - {standing.points}</strong></div>
                        </div>
                        <div className="d-flex align-items-center">
                            {standing.picks.map((pick) => (
                                <div className="me-1" style={{fontSize: "0.75rem"}} key={`user-${standing.user.id}-pick-${pick.id}`}><strong>{pick.first[0]}. {pick.last.slice(0,3)}</strong> - {pick.points}</div>
                            ))}

                            {!selectedSeasonLoading && selectedSeason.top_independent && <div className="me-1" style={{fontSize: "0.75rem"}}><strong>| I: {standing.independent_pick.first[0]}. {standing.independent_pick.last.slice(0,3)}</strong> - {standing.independent_pick.points}</div>}
                            {!selectedSeasonLoading && selectedSeason.top_rookie && <div className="me-1" style={{fontSize: "0.75rem"}}><strong>| R: {standing.rookie_pick.first[0]}. {standing.rookie_pick.last.slice(0,3)}</strong> - {standing.rookie_pick.points}</div>}
                            
                        </div>
                    </div>
                    <hr />
                </div>
                
            )))}
        </div>
        <StandingDetailed />
    </div>);
}