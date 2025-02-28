import React, { useState } from "react";

import { useApplicationContext } from "../../../../ApplicationContext.js";
import RaceCreateAutomatic from "./RaceCreateAutomatic.js";
import RaceCreateManual from "./race-create-manual-components/RaceCreateManual.js";
import { useSeasonContext } from "../../SeasonContext.js";
import RaceCreateContextProvider, { useRaceCreateContext } from "./RaceCreateContext.js";
import Modal from "../../../../util-components/Modal.js";
import { useOpenersContext } from "../../../../OpenersContext.js";

export default function RaceCreateModal(){
    const { openedModal, openModal } = useOpenersContext();
    const { season, seasonLoading } = useSeasonContext();
    const { modalErrorMessage, setModalErrorMessage, resetApplicationMessages, loggedIn, user } = useApplicationContext();
    const { resetVariables } = useRaceCreateContext();

    return (
        <div className="ms-auto">
            <div className="custom-modal" id="race-create-modal" onClick={(e) => {e.stopPropagation()}}>
                <div className="custom-modal-header justify-content-center">
                    <h5>Create Race</h5>
                </div>

                {season.competitors.length == 0 && <div className="alert alert-danger"><small>You need to have competitors added to create a race</small></div>}
                {season.competitors.length != 0 && 
                <div>
                    {modalErrorMessage && <div className="alert alert-danger"><small>{modalErrorMessage}</small></div>}

                    <div className="custom-modal-body">
                        <div className="card rounded-15 clickable mb-2" onClick={() => {resetVariables();openModal("race-create-automatic")}}>
                            <div className="card-body">
                                <div className="d-flex justify-content-center">
                                    <strong>Create race automatically with motorsport link</strong>
                                </div>
                            </div>
                        </div>
                        <div className="card rounded-15 clickable" onClick={(e) => {resetVariables();openModal("race-create-details")}}>
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
        </div>
    )
}