import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { getRaceResults, getSeasonRaces, getSeasonsSimple } from "./fetch-utils/fetchGet";
import { useApplicationContext } from "./ApplicationContext";
import { toggleDropdown, toggleModal } from "./utils";

export default function RaceResults(){
    const { setErrorMessage, setLoadingMessage, modalErrorMessage, setModalErrorMessage, contextLoading } = useApplicationContext();

    const [seasonYear, setSeasonYear] = useState();
    const [seasons, setSeasons] = useState(null);
    const [raceResults, setRaceResults] = useState([]);

    const [loading, setLoading] = useState(true);

    const [openedRaceResult, setOpenedRaceResult] = useState(null);

    const location = useLocation();

    function handleRaceResultModal(event, raceResult){
        setOpenedRaceResult(raceResult);
        toggleModal("race-result-modal", event);
    }

    async function retrieveRaceResults(){
        setLoadingMessage("Loading race results...");

        const params = new URLSearchParams(location.search);
        let seasonYear = params.get("season");
        setSeasonYear(seasonYear);
        const raceResultsResponse = await getSeasonRaces(seasonYear);

        if(raceResultsResponse.error){
            setErrorMessage("There was an error loading the race results.");
            setLoadingMessage(false);
        }

        if(raceResultsResponse.status === 200){
            setRaceResults(raceResultsResponse.races);
        }
    }

    async function retrieveSeasons(){
        let seasonsResponse = await getSeasonsSimple();

        if(seasonsResponse.error){
            console.log(seasonsResponse.error);
            setErrorMessage("There was an error loading the seasons");
            return;
        }

        setSeasons(seasonsResponse.seasons);
    }

    useEffect(() => {
        async function fetchData(){
            await retrieveRaceResults();
            await retrieveSeasons();
            setLoading(false);
        }
        
        fetchData();
    }, [])

    if(contextLoading || loading){
        return null;
    }

    return(
        <div className="mt-2">
            <div className="d-flex align-items-center mt-1">
                {raceResults.length == 0 && (
                    <h4>No race results have been added for this season...</h4>
                )}
                <div className="dropdown ms-auto">
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" onClick={(e) => toggleDropdown("season-selector-dropdown", e, undefined)}>
                        {seasonYear}
                    </button>
                    <ul className="dropdown-menu" id="season-selector-dropdown">
                        {seasons.map((season) => (
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
                        ))}
                    </ul>
                </div>
            </div>
            
            {raceResults.map((raceResult) => (
            <div className="card mt-2 mb-2 rounded-15 clickable" key={`race-result-${raceResult.id}`} onClick={(e) => handleRaceResultModal(e, raceResult)}>
                <div className="rounded-15-top card-header">
                    <div className="d-flex align-items-center">
                        <h3>
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
                                <strong className="col-1">Pos.</strong>
                                <strong className="col-5"># Name</strong>
                            </div>
                            {raceResult.competitors_positions.map((competitor_position) => (
                                <div className="row g-0" key={`competitor-${competitor_position.competitor_points.competitor.id}`} style={{marginRight: "0px"}}>                                       
                                    {competitor_position.position == 0 && <span className="col-1">DNF</span>}
                                    {competitor_position.position != 0 && <span className="col-1">{competitor_position.position}</span>}                     
                                    <span className="col-5"><small>#{competitor_position.competitor_points.competitor.number}</small> {competitor_position.competitor_points.competitor.first} {competitor_position.competitor_points.competitor.last}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            ))}
            <div className="custom-modal hidden" id="race-result-modal">
                {openedRaceResult != null && (
                <div>
                    {modalErrorMessage && <div className="alert alert-danger my-3"><small>{modalErrorMessage}</small></div>}
                    <div className="custom-modal-header d-flex align-items-center">
                        <h3>{openedRaceResult.track} {openedRaceResult.is_sprint && " (Sprint)"}</h3>
                        <div className="ms-auto">
                            <div className="container">
                                {openedRaceResult.finalized && <span className="badge rounded-pill text-bg-success">Final</span>}
                                {!openedRaceResult.finalized && <span className="badge rounded-pill text-bg-secondary">Upcoming</span>}
                            </div>
                        </div>
                    </div>

                    <div className="custom-modal-body">
                        {openedRaceResult.finalized && (
                            <div>
                                <div className="row g-0" style={{marginRight: "0px", padding: "0px"}}>
                                    <strong className="col-2">Pos.</strong>
                                    <strong className="col-6">Name</strong>
                                </div>
                                {openedRaceResult.competitors_positions.map((competitor_position) => (
                                    <div className="row g-0" key={`competitor-${competitor_position.competitor_points.competitor.id}`} style={{marginRight: "0px"}}>   
                                        {competitor_position.position == 0 && <span className="col-2">DNF</span>}
                                        {competitor_position.position != 0 && <span className="col-2">{competitor_position.position}</span>} 
                                        <span className="col-6"><small>#{competitor_position.competitor_points.competitor.number}</small> {competitor_position.competitor_points.competitor.first} {competitor_position.competitor_points.competitor.last}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>  
                </div>
                )}
            </div>
        </div>
    );    
    
    
}