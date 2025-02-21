import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { getRaceResults, getSeasonRaces, getSeasonsSimple } from "../fetch-utils/fetchGet";
import { useApplicationContext } from "../ApplicationContext";
import { toggleDropdown } from "../utils";
import { useRaceResultsContext } from "./RaceResultsContext";

export default function RaceResultsPage({ seasonYear }){
    const { retrieveRaceResults, retrieveRaceResultsDetails, retrieveSeasonList, raceResults, raceResultsLoading, selectedSeason, seasonList, seasonListLoading } = useRaceResultsContext(); 

    async function fetchData(){
        await retrieveRaceResults();
        await retrieveSeasonList();
    }

    useEffect(() => {
        fetchData();
    }, [seasonYear]);

    return(
        <div>
            <div className="card rounded-15 element-background-color element-border-color">
                <div className="card-header d-flex align-items-center">
                    <h5>Race results</h5>
                    <div className="dropdown ms-auto">
                        <button className="btn btn-outline-secondary dropdown-toggle rounded-15" type="button" onClick={(e) => toggleDropdown("season-selector-dropdown", e, undefined)}>
                            {seasonYear}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end" id="season-selector-dropdown" style={{top: "100%", right: "0px"}}>
                            {!seasonListLoading && (seasonList.map((season) => (
                                <li className="ms-2" key={`${season.year}`}>
                                    <Link className="d-flex align-items-center" to={`/raceresults?season=${season.year}`} id={`${season.year}`}>
                                        {season.year}
                                        {season.year == seasonYear && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ms-auto me-1 bi bi-check" viewBox="0 0 16 16">
                                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                                            </svg>
                                        )}
                                    </Link>
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
                    <div key={`race-result-${raceResult.id}`}>
                        <div className="p-2 clickable rounded-15">
                            <Link className="link-no-decorations" to={`/raceresults/${raceResult.id}`}>
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
                            </Link>
                        </div>
                        <hr />
                    </div>
                    )))}
                </div>
            </div>
        </div>
    );    
    
    
}