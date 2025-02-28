import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { getCompetitor, getRace, getSeasonCompetitors, getSeasonRaces } from "../../../fetch-utils/fetchGet";
import { retrieveRaceResult, submitDeleteRace, submitEditRace, submitRace, submitRaceResults } from "../../../fetch-utils/fetchPost";
import { enterKeySubmit, toggleDropdown } from "../../../utils";
import { useSeasonContext } from "../SeasonContext";
import { useApplicationContext } from "../../../ApplicationContext";
import RaceCreateModal from "./race-create-components/RaceCreateModal";
import RaceEditModal from "./race-edit-components/RaceEditModal";
import RaceCreateContextProvider from "./race-create-components/RaceCreateContext";
import Modal from "../../../util-components/Modal";
import { useModalsContext } from "../../../ModalsContext";
import RaceResultModal from "./RaceResultModal";
import RaceCreateAutomatic from "./race-create-components/RaceCreateAutomatic";
import RaceCreateManual from "./race-create-components/race-create-manual-components/RaceCreateManual";
import RaceDetailsCreateModal from "./race-create-components/race-create-manual-components/RaceDetailsCreateModal";
import RaceResultsCreateModal from "./race-create-components/race-create-manual-components/RaceResultsCreateModal";
import RaceSelectCompetitorsCreateModal from "./race-create-components/race-create-manual-components/RaceSelectCompetitorsCreateModal";

export default function RacesManagement(){
    const { openedModal, setOpenedModal } = useModalsContext();
    const { season, seasonLoading, retrieveSeason, editSeasonRace, deleteSeasonRace, createSeasonRace, addSeasonRaceResults } = useSeasonContext();
    const { setErrorMessage, setLoadingMessage, setSuccessMessage, resetApplicationMessages, loggedIn, user, successMessage } = useApplicationContext();

    const [ editRaceId, setEditRaceId ] = useState(null)
    const [ viewRaceTitle, setViewRaceTitle ] = useState(null);

    const [ openedRaceResult, setOpenedRaceResult ] = useState(false);

    useEffect(() => {
        //this is to reset the raceid state variable
        //this is because if the user tries to open the same race to edit again, the provider wouldn't detect a change in the editraceid
        //leading to it to not load the race data
        if(successMessage == "Race edited"){
            setEditRaceId(null);
        }
    }, [successMessage])

    async function openViewResultsModal(e, raceId){
        const raceResponse = await getRace(raceId);

        if(raceResponse.error || raceResponse.status != 200){
            console.log(raceResponse);
            setErrorMessage("There was an error loading the race");
            return;
        }

        setOpenedRaceResult(raceResponse.race);
        setOpenedModal("race-result");
    }

    async function retrieveResults(raceIndex){
        if(!season.races[raceIndex].has_url){
            setErrorMessage("The race has no url associated to it");
            return;
        }

        setLoadingMessage("Loading...");

        const raceResultResponse = await retrieveRaceResult(season.races[raceIndex].id);

        setLoadingMessage(false);

        if(raceResultResponse.error){
            setErrorMessage("There was an error retrieving the race result");
            
            return;
        }

        if(raceResultResponse.status == 400){
            setErrorMessage("There was an error retrieving the race results");
            
            return;
        }

        if(raceResultResponse.status == 404){
            setErrorMessage("The race was not found");
            
            return;
        }

        if(raceResultResponse.status == 408){
            setErrorMessage("motorsport.com took too long to load");
            
            return;
        }

        if(raceResultResponse.status == 422){
            setErrorMessage("The server could not process the race result");
            
            return;
        }

        if(raceResultResponse.status == 503){
            setErrorMessage("Please wait for an existing retrieval to finish, contact admin if there shouldn't be one open");
            
            return;
        }

        if(raceResultResponse.status != 201){
            setErrorMessage("There was an error retrieving the race result");
            
            return;
        }

        setSuccessMessage("Results successfully retrieved");
        
        await retrieveSeason();
        return;
    }

    if(seasonLoading){
        return(<div className="p-3">Loading...</div>);
    }

    return (
        <div>
            <RaceCreateContextProvider>
                <Modal isOpen={openedModal == "race-create"}>
                        <RaceCreateModal/>
                </Modal>
                <Modal isOpen={openedModal == "race-create-automatic"}>
                    <RaceCreateAutomatic />
                </Modal>

                <Modal isOpen={openedModal == "race-create-details"}>
                    <RaceDetailsCreateModal/>
                </Modal>

                <Modal isOpen={openedModal == "race-create-results"}>
                    <RaceResultsCreateModal/>
                </Modal>

                <Modal isOpen={openedModal == "race-create-select-competitors"}>
                    <RaceSelectCompetitorsCreateModal/>
                </Modal>
            </RaceCreateContextProvider>

            

            <Modal isOpen={openedModal == "race-edit"}>
                <RaceEditModal raceId={editRaceId}/>
            </Modal>

            <Modal isOpen={openedModal == "race-result"}>
                <RaceResultModal race={openedRaceResult}/>
            </Modal>

            

            <div className="card-header rounded-15-top">
                <div className="container" style={{paddingLeft: "0px", paddingRight: "0px"}}>
                    <div className="d-flex">
                        <h3>Races</h3>
                        {!season.finalized && 
                        <button className="btn ms-auto" id="create-race-button" onClick={(e) => {resetApplicationMessages();setOpenedModal("race-create")}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="blue" className="bi bi-plus" viewBox="0 0 16 16">
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                            </svg>
                        </button>
                        }
                        
                    </div>
                </div>
            </div>
            <div className="card-body">
            {
                season.races.map((race, i) => (
                    <div className="container card rounded-15 clickable my-1" id={`race-${race.id}`} key={`race-${race.id}`} onClick={(e) => openViewResultsModal(e, race.id)}>
                        <div className="d-flex align-items-center">
                            <div className="container" style={{padding: "0px"}}>
                                <div>{race.title} {race.is_sprint && <span>{`(sprint)`}</span>}</div>
                                <small><strong>{race.timestamp}</strong></small>
                            </div>
                            {race.finalized && <span className="badge rounded-pill text-bg-success ms-auto clickable" onClick={(e) => {openViewResultsModal(e, race.id)}}>Final</span>}
                            {!race.finalized && <span className="badge rounded-pill text-bg-secondary ms-auto clickable" onClick={(e) => {openSelectCompetitorsModal(e);setTempRaceId(race.id)}}>Upcoming</span>}
                            <div className="dropdown-div" onClick={(e) => toggleDropdown(`dropdown-race-${race.id}`, e)}>
                                <div className="d-flex align-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                    </svg>
                                </div>
                                <ul id={`dropdown-race-${race.id}`} className="dropdown-menu">
                                    <li><button id="edit-race-button" className="dropdown-item" onClick={(e) => {setEditRaceId(race.id);setOpenedModal("race-edit")}}>Edit</button></li>
                                    {(!race.finalized && !race.has_url) && <li><button id="add-results-race-button" className="dropdown-item" onClick={(e) => {openSelectCompetitorsModal(e)}}>Add Results</button></li>}
                                    {(!race.finalized && race.has_url) && <li><button id="retrieve-results-race-button" className="dropdown-item" onClick={(e) => {retrieveResults(i)}}>Retrieve Results</button></li>}
                                    {race.finalized && <li><button id="view-race-results-button" className="dropdown-item" onClick={(e) => openViewResultsModal(e, race.id)}>View Race Results</button></li>}
                                    <li><button className="dropdown-item" onClick={() => deleteSeasonRace(race.id)}>Delete</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ))
            }
            </div>
        </div>
    )
}