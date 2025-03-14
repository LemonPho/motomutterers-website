import React, { useState } from "react";
import { useSeasonContext } from "../SeasonContext";
import Modal from "../../../util-components/Modal";
import { useOpenersContext } from "../../../OpenersContext";
import { useApplicationContext } from "../../../ApplicationContext";
import CreateRaceWeekendModal from "./CreateRaceWeekendModal";
import Dropdown from "../../../util-components/Dropdown";
import EditRaceWeekendModal from "./EditRaceWeekendModal";
import { useRaceWeekendContext } from "./RaceWeekendContext";
import RaceWeekendModal from "./RaceWeekendModal";

export default function RaceWeekendsManagement(){
    const { season } = useSeasonContext();
    const { deleteRaceWeekend, retrieveRaceWeekend } = useRaceWeekendContext();
    const { openedModal, openModal, openedDropdown, toggleDropdown } = useOpenersContext();
    const { resetApplicationMessages } = useApplicationContext();

    return(
        <div className="col-md card rounded-15 element-background-color element-border-color p-0">
            <Modal isOpen={openedModal == "race-weekend-create"}>
                <CreateRaceWeekendModal />
            </Modal>

            <Modal isOpen={openedModal == "race-weekend-edit"}>
                <EditRaceWeekendModal/>
            </Modal>

            <Modal isOpen={openedModal == "race-weekend"}>
                <RaceWeekendModal/>
            </Modal>

            <div className="card-header nested-element-color d-flex m-2 rounded-15">
                <h3>Race Weekends</h3>
                {!season.finalized && 
                <button className="btn ms-auto" id="create-race-button" onClick={(e) => {resetApplicationMessages();openModal("race-weekend-create")}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="blue" className="bi bi-plus" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
                </button>
                }
            </div>

            <div className="card-body m-2 p-0 rounded-15">
                {season.race_weekends.map((raceWeekend) => (
                    <div className="container card rounded-15 clickable nested-element-color p-2 mb-2" id={`race-${raceWeekend.id}`} key={`race-${raceWeekend.id}`} onClick={() => {retrieveRaceWeekend(raceWeekend.id); openModal("race-weekend")}}>
                        <div className="d-flex align-items-center">
                            <div className="container" style={{padding: "0px"}}>
                                <div>{raceWeekend.title}</div>
                                <small><strong>{raceWeekend.start} - {raceWeekend.end}</strong></small>
                            </div>
                            {raceWeekend.final && <span className="badge rounded-pill text-bg-success ms-auto">Final</span>}
                            {!raceWeekend.final && <span className="badge rounded-pill text-bg-secondary ms-auto">Upcoming</span>}
                            <div className="dropdown-div" onClick={(e) => toggleDropdown(`dropdown-race-weekend-${raceWeekend.id}`, e)}>
                                <div className="d-flex align-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                    </svg>
                                </div>
                                <Dropdown isOpen={openedDropdown == `dropdown-race-weekend-${raceWeekend.id}`}>
                                    <ul id={`dropdown-race-weekend${raceWeekend.id}`} className="dropdown-menu">
                                        <li><button id="edit-race-weekend-button" className="dropdown-item" onClick={(e) => {retrieveRaceWeekend(raceWeekend.id);openModal("race-weekend-edit")}}>Edit</button></li>
                                        <li><button className="dropdown-item" onClick={() => deleteRaceWeekend(raceWeekend.id)}>Delete</button></li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                ))
                
                }
            </div>
        </div>
    )
}