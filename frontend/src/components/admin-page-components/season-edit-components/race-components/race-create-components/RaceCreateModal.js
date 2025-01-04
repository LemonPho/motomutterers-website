import React, { useState } from "react";

import { closeDropdowns, closeModals, enterKeySubmit, toggleDropdown, toggleModal } from "../../../../utils.js";
import { useApplicationContext } from "../../../../ApplicationContext.js";
import RaceCreateAutomatic from "./RaceCreateAutomatic.js";
import RaceCreateManual from "./race-create-manual-components/RaceCreateManual.js";
import { useSeasonContext } from "../../SeasonContext.js";
import RaceCreateContextProvider, { useRaceCreateContext } from "./RaceCreateContext.js";

export default function RaceCreateModal(){
    const { season, seasonLoading } = useSeasonContext();
    const { modalErrorMessage, setModalErrorMessage, resetApplicationMessages, loggedIn, user } = useApplicationContext();
    const { resetVariables } = useRaceCreateContext();

    const [ canCreateRace, setCanCreateRace ] = useState(() => {
        if(!seasonLoading){
            if(season.competitors.length != 0){
                return true;
            } else {
                return false;
            }
        }
    }) 

    return (
        <div className="ms-auto">
            <div className="custom-modal hidden" id="race-create-modal" onClick={(e) => {e.stopPropagation()}}>
                <div className="custom-modal-header justify-content-center">
                    <h5>Create Race</h5>
                </div>

                {!canCreateRace && <div className="alert alert-danger"><small>You need to have competitors added to create a race</small></div>}
                {canCreateRace && 
                <div>
                    {modalErrorMessage && <div className="alert alert-danger"><small>{modalErrorMessage}</small></div>}

                    <div className="custom-modal-body">
                        <div className="card rounded-15 clickable mb-2" onClick={(e) => {resetApplicationMessages();toggleModal("race-create-automatic-modal", e, loggedIn, user.is_admin)}}>
                            <div className="card-body">
                                <div className="d-flex justify-content-center">
                                    <strong>Create race automatically with motorsport link</strong>
                                </div>
                            </div>
                        </div>
                        <div className="card rounded-15 clickable" onClick={(e) => {resetVariables();toggleModal("create-race-details-manual-modal", e, loggedIn, user.is_admin)}}>
                            <div className="card-body">
                                <div className="d-flex justify-content-center">
                                    <strong>Create race manually</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                }
            </div>

            <RaceCreateAutomatic />
            <RaceCreateManual />
            
        </div>
    )
}