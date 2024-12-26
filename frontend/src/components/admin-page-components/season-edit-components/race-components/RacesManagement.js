import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { getCompetitor, getRace, getSeasonCompetitors, getSeasonRaces } from "../../../fetch-utils/fetchGet";
import { submitDeleteRace, submitEditRace, submitRace, submitRaceResults } from "../../../fetch-utils/fetchPost";
import { closeDropdowns, closeModals, enterKeySubmit, toggleDropdown, toggleModal } from "../../../utils";
import { useSeasonContext } from "../SeasonContext";
import { useApplicationContext } from "../../../ApplicationContext";
import RaceCreateModal from "./race-create-components/RaceCreateModal";
import RaceEditContextProvider from "./race-edit-components/RaceEditContext";
import RaceEditModal from "./race-edit-components/RaceEditModal";

export default function RacesManagement(){
    const { season, seasonLoading, retrieveSeason, editSeasonRace, deleteSeasonRace, createSeasonRace, addSeasonRaceResults } = useSeasonContext();
    const { modalErrorMessage, setModalErrorMessage, resetApplicationMessages, loggedIn, user, successMessage } = useApplicationContext();

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
            setModalErrorMessage("There was an error loading the race");
            return;
        }

        setOpenedRaceResult(raceResponse.race);
        toggleModal("race-result-modal", e, loggedIn, user.is_admin);
    }


    if(seasonLoading){
        return(<div className="p-3">Loading...</div>);
    }

    return (
        <div>
            <RaceCreateModal/>
            <RaceEditContextProvider raceId={editRaceId}>
                <RaceEditModal/>
            </RaceEditContextProvider>

            <div className="custom-modal hidden" id="race-result-modal">
                <div className="custom-modal-header">
                    {openedRaceResult && <h5>{openedRaceResult.title}</h5>}
                </div>

                {modalErrorMessage && <div className="alert alert-danger"><small>{modalErrorMessage}</small></div>}

                <hr />

                <div className="custom-modal-body">
                    <div>
                        <div className="row g-0" style={{marginRight: "0px", padding: "0px"}}>
                            <strong className="col-2">Pos.</strong>
                            <strong className="col-6">Name</strong>
                        </div>
                        {openedRaceResult && 
                            openedRaceResult.competitors_positions.map((competitor_position) => (
                                <div className="row g-0" key={`competitor-${competitor_position.competitor_id}`} style={{marginRight: "0px"}}>   
                                    {competitor_position.position == 0 && <span className="col-2">DNF</span>}
                                    {competitor_position.position != 0 && <span className="col-2">{competitor_position.position}</span>} 
                                    <span className="col-6"><small>#{competitor_position.number}</small> {competitor_position.first} {competitor_position.last}</span>
                                </div>
                            ))}
                    </div>
                </div>

            </div>

            <div className="card-header rounded-15-top">
                <div className="container" style={{paddingLeft: "0px", paddingRight: "0px"}}>
                    <div className="d-flex">
                        <h3>Races</h3>
                        {!season.finalized && 
                        <button className="btn ms-auto" id="create-race-button" onClick={(e) => {resetApplicationMessages();toggleModal("race-create-modal", e, loggedIn, user.is_admin)}}>
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
                season.races.map((race) => (
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
                                    <li><button id="edit-race-button" className="dropdown-item" onClick={(e) => {setEditRaceId(race.id);toggleModal("race-edit-modal", e, loggedIn, user.is_admin)}}>Edit</button></li>
                                    {!race.finalized && <li><button id="add-results-race-button" className="dropdown-item" onClick={(e) => {openSelectCompetitorsModal(e)}}>Add Results</button></li>}
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