import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { getRaceResults, getSeasonRaces, getSeasonsSimple } from "../fetch-utils/fetchGet";
import { useApplicationContext } from "../ApplicationContext";
import { toggleDropdown, toggleModal } from "../utils";
import { useRaceResultsContext } from "./RaceResultsContext";

export default function RaceResultsPage({ seasonYear }){
    const { retrieveRaceResults, retrieveRaceResultsDetails, retrieveSeasonList, raceResults, raceResultsLoading, selectedSeason, seasonList, seasonListLoading } = useRaceResultsContext(); 

    useEffect(() => {
        async function fetchData(){
            await retrieveRaceResults();
            await retrieveSeasonList();
        }
        
        fetchData();
    }, [])

    return(
        <div>
            <div className="card rounded-15 mt-4 element-background-color element-border-color">
                <div className="card-header d-flex align-items-center">
                    <h5>Race results</h5>
                    <div className="dropdown ms-auto">
                        <button className="btn btn-outline-secondary dropdown-toggle" type="button" onClick={(e) => toggleDropdown("season-selector-dropdown", e, undefined)}>
                            {seasonYear}
                        </button>
                        <ul className="dropdown-menu" id="season-selector-dropdown">
                            {!seasonListLoading && (seasonList.map((season) => (
                                <li className="ms-2" key={`${season.year}`}>
                                    <a className="d-flex align-items-center" href={`/raceresults?season=${season.year}`} id={`${season.year}`}>
                                        {season.year}
                                        {season.year == seasonYear && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ms-auto me-1 bi bi-check" viewBox="0 0 16 16">
                                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                                            </svg>
                                        )}
                                    </a>
                                </li>
                            )))}
                        </ul>
                    </div>
                </div>
                <div className="card-body">
                    {(!raceResultsLoading && raceResults != undefined && raceResults.length == 0) && (
                    <h5>No race results have been added for this season.</h5>
                    )}
            
                    {(!raceResultsLoading && raceResults != undefined) && (raceResults.map((raceResult) => (
                    <div className="p-2 clickable rounded-15" key={`race-result-${raceResult.id}`}>
                        <a className="link-no-decorations" href={`/raceresults/${raceResult.id}`}>
                            <div>
                                <div className="d-flex align-items-center">
                                    <h3 className="p-2">
                                        {raceResult.title}
                                        {raceResult.is_sprint && " (Sprint)"}
                                    </h3>
                                    <div className="ms-auto">
                                        <div className="container">
                                            {raceResult.finalized && <span className="badge rounded-pill text-bg-success">Final</span>}
                                            {!raceResult.finalized && <span className="badge rounded-pill text-bg-secondary">Upcoming</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                {raceResult.finalized && (
                                    <div>
                                        <div className="row g-0" style={{marginRight: "0px", padding: "0px"}}>
                                            <strong className="col-2">Pos.</strong>
                                            <strong className="col-2">#</strong>
                                            <strong className="col-6">Name</strong>
                                        </div>
                                        {raceResult.competitors_positions.map((competitor_position) => (
                                            <div className="row g-0" key={`competitor-${competitor_position.competitor_id}`} style={{marginRight: "0px"}}>                                       
                                                {competitor_position.position == 0 && <span className="col-2">-</span>}
                                                {competitor_position.position != 0 && <span className="col-2">{competitor_position.position}</span>}
                                                <span className="col-2"><small><strong>#{competitor_position.number}</strong></small></span>           
                                                <span className="col-6">{competitor_position.first} {competitor_position.last}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </a>
                    </div>
                    )))}
                </div>
            </div>
        </div>
    );    
    
    
}