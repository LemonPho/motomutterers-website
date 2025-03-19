import React, { useState } from "react";
import { useRaceWeekendContext } from "./RaceWeekendContext";
import { useOpenersContext } from "../../../OpenersContext";

export default function RaceWeekendModal(){
    const { deleteRaceWeekend, selectedRaceWeekend, selectedRaceWeekendLoading, retrieveRaceWeekendEvent } = useRaceWeekendContext();
    const { openModal } = useOpenersContext();

    const [confirmDelete, setConfirmDelete] = useState(false);

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
        await retrieveRaceWeekendEvent(1);
    }

    async function retrieveSprintRace(){
        await retrieveRaceWeekendEvent(2);

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
                    <div className="card-header">
                        Grid
                    </div>
                    <div className="card-body" style={{"maxHeight": "100px"}}>
                        {selectedRaceWeekend.grid.length != 0 && 
                        <div>
                            qualifying data goes here
                        </div>}
                        {selectedRaceWeekend.grid.length == 0 && <button className="btn btn-primary rounded-15">Retrieve</button>}
                    </div>
                </div>
                <div className="card text-center rounded-15 mb-2">
                    <div className="card-header">
                        Race
                    </div>
                    <div className="card-body" style={{"maxHeight": "100px"}}>
                        {selectedRaceWeekend.race != null && 
                        <div>
                            {selectedRaceWeekend.race.competitors_positions.map((competitorPosition) => (
                                <div className="row">
                                    <div className="col-2">
                                        <strong>{competitorPosition.position}.</strong>
                                    </div>
                                    <div className="col-2">
                                        <span>#{competitorPosition.number}</span>
                                    </div>
                                    <div className="col-4">
                                        <span>{competitorPosition.first} {competitorPosition.last}</span>
                                    </div>
                                    <div className="col-2">
                                        <span>{competitorPosition.points}</span>
                                    </div>
                                </div>
                            ))}
                        </div>}
                        {selectedRaceWeekend.race == null && <button className="btn btn-primary rounded-15" onClick={retrieveRace}>Retrieve</button>}
                    </div>  
                </div>
            
                <div className="card text-center rounded-15 mb-2">
                    <div className="card-header">
                        Sprint Race
                    </div>
                    <div className="card-body" style={{"maxHeight": "100px"}}>
                        {selectedRaceWeekend.sprint_race != null && 
                        <div>
                            Sprint Race data goes here
                        </div>}
                        {selectedRaceWeekend.sprint_race == null && <button className="btn btn-primary rounded-15" onClick={retrieveSprintRace}>Retrieve</button>}
                    </div>  
                </div>
            </div>
            <div className="custom-modal-footer">
                {!confirmDelete && <button className="btn btn-outline-danger rounded-15 w-100" onClick={handleDeleteClicked}>Delete race weekend</button>}
                {confirmDelete && <button className="btn btn-outline-danger rounded-15 w-100" onClick={handleDeleteClicked}>Click again to delete</button>}
            </div>
        </div>
    )
}