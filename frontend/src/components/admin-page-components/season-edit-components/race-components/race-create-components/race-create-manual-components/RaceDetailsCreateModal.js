import React, { useState } from "react";
import { useApplicationContext } from "../../../../../ApplicationContext";
import { autoResizeTextarea, enterKeySubmit, toggleModal } from "../../../../../utils";
import { useRaceCreateContext } from "../RaceCreateContext";

export default function RaceDetailsCreateModal(){
    const { loggedIn, user, setErrorMessage, resetApplicationMessages } = useApplicationContext();
    const { track, title, timestamp, isSprint, setTrack, setTitle, setTimestamp, setIsSprint, resetVariables } = useRaceCreateContext();

    function next(e){
        if(track == "" || title == "" || timestamp == 0){
            setErrorMessage("Make sure the fields are filled in");
            return;
        }

        resetApplicationMessages();
        toggleModal("competitors-select-modal", e, loggedIn, user.is_admin, false);
    }
    
    function handleTrackChange(e){
        setTrack(e.currentTarget.value);
    }

    function handleTitleNameChange(e){
        setTitle(e.currentTarget.value);
    }

    function handleTimestampChange(e){
        setTimestamp(e.currentTarget.value);
    }

    function handleSprintSelection(e){
        setIsSprint(e.currentTarget.checked);
    }

    return (
        <div className="custom-modal hidden" id="create-race-details-manual-modal" onClick={(e) => {e.stopPropagation()}}>
            <div className="custom-modal-header justify-content-center">
                <h5>Race Details</h5>
            </div>

            <hr />

            <div className="custom-modal-body">
                <textarea rows={1} id="race-create-track" className='input-field textarea-expand mt-2 w-100' data-category="input-field" placeholder="Track name..." onKeyUp={(e) => {enterKeySubmit(e, next);handleTrackChange(e)}} onChange={(e) => autoResizeTextarea(e.target)}></textarea>
                <textarea rows={1} id="race-create-title" className='input-field textarea-expand mt-2 w-100' data-category="input-field" placeholder="Race title..." onKeyUp={(e) => {enterKeySubmit(e, next);handleTitleNameChange(e)}} onChange={(e) => autoResizeTextarea(e.target)}></textarea>
                <div className="d-flex justify-content-center">
                    <input id="race-create-date" type="date" className="input-field flex-grow-1 mt-2" data-category="input-field" onChange={(e) => handleTimestampChange(e)} onKeyUp={(e) => enterKeySubmit(e, next)}/>
                </div>
                <div className="form-check mt-1">
                    <input id="race-create-sprint" type="checkbox" className="form-check-input" data-category="input-field" value={isSprint} onChange={(e) => handleSprintSelection(e)} onKeyUp={(e) => enterKeySubmit(e, next)}/>
                    <label className="form-check-label" htmlFor="race-create-sprint">Sprint Race</label>
                </div>
            </div>

            <div className="custom-modal-footer">
                <button className="btn btn-primary rounded-15 w-100" onClick={(e) => {next(e)}}>Next</button>
            </div>
        </div>
    )
}