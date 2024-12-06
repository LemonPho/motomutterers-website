import React, { useEffect } from "react";
import { useApplicationContext } from "../../../../ApplicationContext";
import { useRaceEditContext } from "./RaceEditContext";
import { enterKeySubmit } from "../../../../utils";

export default function RaceEditModal(){
    const { modalErrorMessage } = useApplicationContext();
    const { track, title, isSprint, timestamp, setTrack, setTitle, setIsSprint, setTimestamp, editRace, raceEditLoading } = useRaceEditContext(); 

    async function saveChanges(){
        await editRace();
    }

    useEffect(() => {
        if(!raceEditLoading){
            if(track != "" && title != ""){
                document.getElementById("race-edit-track").innerHTML = track;
                document.getElementById("race-edit-title").innerHTML = title;
            }
        }
    }, [raceEditLoading])

    return (
        <div className="custom-modal hidden" id="race-edit-modal" onClick={(e) => {e.stopPropagation();}}>
            <div className="custom-modal-header justify-content-center">
                <h5>Edit Race</h5>
            </div>

            <hr />

            {modalErrorMessage && <div className="alert alert-danger"><small>{modalErrorMessage}</small></div>}

            <div className="custom-modal-body">
                <div id="race-edit-track" className='input-field mt-2' contentEditable={true} data-placeholder="Track name..." onKeyUp={(e) => {enterKeySubmit(e, saveChanges);setTrack(e.currentTarget.innerHTML)}}></div>
                <div id="race-edit-title" className='input-field mt-2' contentEditable={true} data-placeholder="Race title..." onKeyUp={(e) => {enterKeySubmit(e, saveChanges);setTitle(e.currentTarget.innerHTML)}}></div>
                <div className="d-flex justify-content-center">
                    <input id="race-edit-date" type="date" className="input-field flex-grow-1 mt-2" value={timestamp} onChange={(e) => setTimestamp(e.currentTarget.value)} onKeyUp={(e) => enterKeySubmit(e, saveChanges)}/>
                </div>
                <div className="form-check mt-1">
                    <input id="race-edit-sprint" type="checkbox" className="form-check-input" checked={isSprint} onChange={() => {setIsSprint(!isSprint);console.log(isSprint)}} onKeyUp={(e) => enterKeySubmit(e, saveChanges)}/>
                    <label className="form-check-label" htmlFor="race-edit-sprint">Sprint Race</label>
                </div>
            </div>

            <div className="custom-modal-footer">
                <button className="btn btn-primary ms-auto" onClick={saveChanges}>Save changes</button>
            </div>
        </div>
    )
}