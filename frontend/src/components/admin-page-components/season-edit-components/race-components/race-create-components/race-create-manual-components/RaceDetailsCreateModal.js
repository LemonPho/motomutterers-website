import React, { useState } from "react";
import { useApplicationContext } from "../../../../../ApplicationContext";
import { enterKeySubmit, toggleModal } from "../../../../../utils";
import { useRaceCreateContext } from "./RaceCreateContext";

export default function RaceDetailsCreateModal(){
    const { modalErrorMessage, loggedIn, user } = useApplicationContext();
    const { track, title, timestamp, isSprint, setTrack, setTitle, setTimestamp, setIsSprint } = useRaceCreateContext();

    const [invalidData, setInvalidData] = useState(false);

    function next(e){
        if(track == "" || title == "" || timestamp == 0){
            setInvalidData(true);
            return;
        }

        toggleModal("competitors-select-modal", e, loggedIn, user.is_admin)
    }
    
    function handleTrackChange(e){
        setTrack(e.currentTarget.innerHTML);
    }

    function handleTitleNameChange(e){
        setTitle(e.currentTarget.innerHTML);
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

            {modalErrorMessage && <div className="alert alert-danger"><small>{modalErrorMessage}</small></div>}
            {invalidData && <div className="alert alert-danger"><small>Make sure all the fields are filled in</small></div>}

            <hr />

            <div className="custom-modal-body">
                <div id="race-create-track" className='input-field mt-2' contentEditable={true} data-placeholder="Track name..." onKeyUp={(e) => {enterKeySubmit(e, next);handleTrackChange(e)}}></div>
                <div id="race-create-title" className='input-field mt-2' contentEditable={true} data-placeholder="Race title..." onKeyUp={(e) => {enterKeySubmit(e, next);handleTitleNameChange(e)}}></div>
                <div className="d-flex justify-content-center">
                    <input id="race-create-date" type="date" className="input-field flex-grow-1 mt-2" onChange={(e) => handleTimestampChange(e)} onKeyUp={(e) => enterKeySubmit(e, next)}/>
                </div>
                <div className="form-check mt-1">
                    <input id="race-create-sprint" type="checkbox" className="form-check-input" value={timestamp} onChange={(e) => handleSprintSelection(e)} onKeyUp={(e) => enterKeySubmit(e, next)}/>
                    <label className="form-check-label" htmlFor="race-create-sprint">Sprint Race</label>
                </div>
            </div>

            <div className="custom-modal-footer">
                <button className="btn btn-primary rounded-15 ms-auto" onClick={(e) => {next(e)}}>Next</button>
            </div>
        </div>
    )
}