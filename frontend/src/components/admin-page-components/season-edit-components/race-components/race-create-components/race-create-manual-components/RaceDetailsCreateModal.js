import React, { useState } from "react";
import { useApplicationContext } from "../../../../../ApplicationContext";
import { autoResizeTextarea, enterKeySubmit } from "../../../../../utils";
import { useRaceCreateContext } from "../RaceCreateContext";
import { useOpenersContext } from "../../../../../OpenersContext";
import Textarea from "../../../../../util-components/Textarea";

export default function RaceDetailsCreateModal(){
    const { openModal } = useOpenersContext();
    const { loggedIn, user, setErrorMessage, resetApplicationMessages } = useApplicationContext();
    const { track, title, timestamp, isSprint, setTrack, setTitle, setTimestamp, setIsSprint, resetVariables } = useRaceCreateContext();

    function next(){
        if(track == "" || title == "" || timestamp == 0){
            setErrorMessage("Make sure the fields are filled in");
            return;
        }

        resetApplicationMessages();
        openModal("race-create-select-competitors")
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
        <div className="custom-modal" id="create-race-details-manual-modal" onClick={(e) => {e.stopPropagation()}}>
            <div className="custom-modal-header justify-content-center">
                <h5>Race Details</h5>
            </div>

            <hr />

            <div className="custom-modal-body">
                <Textarea id={"race-create-track"} className={"mt-2"} placeholder={"Track name..."} value={track} setValue={setTrack} onEnterFunction={next}/>
                <Textarea id={"race-create-title"} className={"mt-2"} placeholder={"Race title..."} value={title} setValue={setTitle} onEnterFunction={next}/>
                <div className="d-flex justify-content-center">
                    <input id="race-create-date" type="date" className="input-field flex-grow-1 mt-2" data-category="input-field" defaultValue={timestamp} onChange={(e) => handleTimestampChange(e)} onKeyUp={(e) => enterKeySubmit(e, next)}/>
                </div>
                <div className="form-check mt-1">
                    <input id="race-create-sprint" type="checkbox" className="form-check-input" data-category="input-field" defaultChecked={isSprint} onChange={(e) => handleSprintSelection(e)} onKeyUp={(e) => enterKeySubmit(e, next)}/>
                    <label className="form-check-label" htmlFor="race-create-sprint">Sprint Race</label>
                </div>
            </div>

            <div className="custom-modal-footer">
                <button className="btn btn-primary rounded-15 w-100" onClick={(e) => {next(e)}}>Next</button>
            </div>
        </div>
    )
}