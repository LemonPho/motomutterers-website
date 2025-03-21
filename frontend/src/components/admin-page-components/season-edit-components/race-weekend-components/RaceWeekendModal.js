import React, { useState } from "react";
import { useRaceWeekendContext } from "./RaceWeekendContext";
import { useOpenersContext } from "../../../OpenersContext";
import { submitDeleteRace } from "../../../fetch-utils/fetchPost";
import { useSeasonContext } from "../SeasonContext";
import { useApplicationContext } from "../../../ApplicationContext";

export default function RaceWeekendModal(){
    const { season } = useSeasonContext();
    const { setErrorMessage, setSuccessMessage } = useApplicationContext();
    
    const { deleteRaceWeekend, selectedRaceWeekend, selectedRaceWeekendLoading, retrieveRaceWeekendEvent, postFinalizeRaceWeekend, postUnFinalizeRaceWeekend, setSelectedRaceWeekend, retrieveRaceWeekend } = useRaceWeekendContext();
    const { openModal } = useOpenersContext();

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [retrieveLoading, setRetrieveLoading] = useState(false);
    const [finalizeLoading, setFinalizeLoading] = useState(false);

    async function handleDeleteClicked(){
        if(!confirmDelete){
            setConfirmDelete(!confirmDelete);
            return;
        }

        deleteRaceWeekend(selectedRaceWeekend.id);
    }

    async function retrieveGrid(){

    }

    async function retrieveRace(){
        setRetrieveLoading(true);
        await retrieveRaceWeekendEvent(1);
        setRetrieveLoading(false);
        await retrieveRaceWeekend(selectedRaceWeekend.id);

    }

    async function retrieveSprintRace(){
        setRetrieveLoading(true);
        await retrieveRaceWeekendEvent(2);
        setRetrieveLoading(false);
        await retrieveRaceWeekend(selectedRaceWeekend.id);
    }

    async function finalizeRaceWeekend(){
        setFinalizeLoading(true);
        await postFinalizeRaceWeekend();
        setFinalizeLoading(false);
    }

    async function unFinalizeRaceWeekend(){
        setFinalizeLoading(true);
        await postUnFinalizeRaceWeekend();
        setFinalizeLoading(false);
    }

    async function deleteRace(raceId){
        const raceResponse = await submitDeleteRace(raceId, season.year);

        if(raceResponse.error || raceResponse.status != 201){
            setErrorMessage("There was an error deleting the race");
            return false;
        }

        setSuccessMessage("Race deleted");
        return true
    }

    async function deleteSprintRace(raceId){
        if(await deleteRace(raceId)){
            let temporaryRaceWeekend = selectedRaceWeekend;
            temporaryRaceWeekend.sprint_race = null;
            setSelectedRaceWeekend(temporaryRaceWeekend)
        }
    }

    async function deleteMainRace(raceId){
        if(await deleteRace(raceId)){
            let temporaryRaceWeekend = selectedRaceWeekend;
            temporaryRaceWeekend.race = null;
            setSelectedRaceWeekend(temporaryRaceWeekend)
        }
    }

    if(selectedRaceWeekendLoading){
        return;
    }

    return(
        <div className="custom-modal">
            <div className="custom-modal-header">
                <h4>{selectedRaceWeekend.title}</h4>
                <button className="btn btn-outline-primary rounded-15 ms-auto" onClick={() => openModal("race-weekend-edit")}>Edit</button>
            </div>
            <hr />
            <div className="custom-modal-body">
                <div className="card text-center rounded-15 mb-2">
                    <div className="card-header d-flex align-items-center">
                        <h5>Race</h5>
                        {(selectedRaceWeekend.race != null && selectedRaceWeekend.status != 2) && <button className="ms-auto btn btn-outline-danger rounded-15" onClick={() => deleteMainRace(selectedRaceWeekend.race.id)}>Delete</button>}
                    </div>
                    <div className="card-body" style={{"maxHeight": "175px", 'overflowY': "auto"}}>
                        {selectedRaceWeekend.race != null && 
                            selectedRaceWeekend.race.competitors_positions.map((competitorPosition) => (
                                <div className="d-flex align-items-center p-2 mb-2 bg-light border rounded shadow-sm" key={competitorPosition.number}>
                                    <div style={{ width: "30px" }} className="text-center">
                                        {(competitorPosition.position == 0) && <span className="fw-bold">-</span>}
                                        {(competitorPosition.position != 0) && <span className="fw-bold">{competitorPosition.position}</span>}
                                    </div>
                                    <div style={{ width: "50px" }} className="text-muted text-center">
                                        #{competitorPosition.number}
                                    </div>
                                    <div style={{ width: "200px" }} className="fw-semibold">
                                        {competitorPosition.first} {competitorPosition.last}
                                    </div>
                                    <div style={{ width: "50px" }} className="fw-bold text-center">
                                        {competitorPosition.points}
                                    </div>
                                </div>
                            ))}
                        {(selectedRaceWeekend.race == null && !retrieveLoading) && <button className="btn btn-primary rounded-15" onClick={retrieveRace}>Retrieve</button>}
                        {(selectedRaceWeekend.race == null && retrieveLoading) && <button className="btn btn-primary rounded-15" disabled>Loading...</button>}
                    </div>  
                </div>
            
                <div className="card text-center rounded-15 mb-2">
                    <div className="card-header d-flex align-items-center">
                        <h5>Sprint race</h5>
                        {(selectedRaceWeekend.sprint_race != null && selectedRaceWeekend.status != 2) && <button className="ms-auto btn btn-outline-danger rounded-15" onClick={() => deleteSprintRace(selectedRaceWeekend.sprint_race.id)}>Delete</button>}  
                    </div>
                    <div className="card-body" style={{"maxHeight": "175px", "overflowY": "auto"}}>
                        {selectedRaceWeekend.sprint_race != null && 
                            selectedRaceWeekend.sprint_race.competitors_positions.map((competitorPosition) => (
                                <div className="d-flex align-items-center p-2 mb-2 bg-light border rounded shadow-sm" key={competitorPosition.number}>
                                    <div style={{ width: "30px" }} className="text-center">
                                        {(competitorPosition.position == 0) && <span className="fw-bold">-</span>}
                                        {(competitorPosition.position != 0) && <span className="fw-bold">{competitorPosition.position}</span>}
                                    </div>
                                    <div style={{ width: "50px" }} className="text-muted text-center">
                                        #{competitorPosition.number}
                                    </div>
                                    <div style={{ width: "200px" }} className="fw-semibold">
                                        {competitorPosition.first} {competitorPosition.last}
                                    </div>
                                    <div style={{ width: "50px" }} className="fw-bold text-center">
                                        {competitorPosition.points}
                                    </div>
                                </div>
                            ))}
                        {(selectedRaceWeekend.sprint_race == null && !retrieveLoading) && <button className="btn btn-primary rounded-15" onClick={retrieveSprintRace}>Retrieve</button>}
                        {(selectedRaceWeekend.sprint_race == null && retrieveLoading) && <button className="btn btn-primary rounded-15" disabled>Loading...</button>}
                    </div>  
                </div>
            </div>
            <div className="custom-modal-footer d-flex flex-column">
                {((selectedRaceWeekend.status == 1 || selectedRaceWeekend.status == 0) && !finalizeLoading) && <button className="btn btn-primary rounded-15 w-100 mb-2" onClick={finalizeRaceWeekend}>Finalize</button>}
                {(selectedRaceWeekend.status == 2 && !finalizeLoading) && <button className="btn btn-primary rounded-15 mb-2 w-100" onClick={unFinalizeRaceWeekend}>Un-finalize</button>}
                {finalizeLoading && <button className="btn btn-primary rounded-15 mb-2 w-100" disabled>Loading...</button>}
                {!confirmDelete && <button className="btn btn-outline-danger rounded-15 w-100 mb-1" onClick={handleDeleteClicked}>Delete race weekend</button>}
                {confirmDelete && <button className="btn btn-outline-danger rounded-15 w-100" onClick={handleDeleteClicked}>Click again to delete</button>}
            </div>
        </div>
    )
}