import React, { useEffect, useState } from "react";
import { useApplicationContext } from "../../../../ApplicationContext";
import { autoResizeTextarea, enterKeySubmit } from "../../../../utils";
import { useSeasonContext } from "../../SeasonContext";
import { getRace } from "../../../../fetch-utils/fetchGet";
import { submitEditRace } from "../../../../fetch-utils/fetchPost";
import { useOpenersContext } from "../../../../OpenersContext";
 
export default function RaceEditModal({ raceId }){
    const { modalErrorMessage } = useApplicationContext();

    const { setModalErrorMessage, setSuccessMessage, resetApplicationMessages } = useApplicationContext();
    const { retrieveSeason } = useSeasonContext();
    const { closeModal } = useOpenersContext();

    const [originalRaceData, setOriginalRaceData] = useState({});

    const [track, setTrack] = useState("");
    const [title, setTitle] = useState("");
    const [timestamp, setTimestamp] = useState("");
    const [isSprint, setIsSprint] = useState(false);
    const [raceEditLoading, setRaceEditLoading] = useState(true);

    function resetVariables(){
        setTrack("");
        setTitle("");
        setTimestamp("");
        setIsSprint(false);
    }

    async function retrieveRaceDetails(){
        resetApplicationMessages();
        //when there isn't a race selected to edit in the beginning raceId is null
        if(raceId == null){
            return;
        }

        const raceResponse = await getRace(raceId);

        if(raceResponse.status != 200 && raceResponse.status != 201){
            setModalErrorMessage("There was an error retrieving the race data");
            return;
        }

        setTrack(raceResponse.race.track);
        setTitle(raceResponse.race.title);
        setTimestamp(raceResponse.race.timestamp);
        setIsSprint(raceResponse.race.is_sprint);
        setOriginalRaceData(raceResponse.race);
    }

    async function editRace(){
        resetApplicationMessages();

        const newRace = {
            title: title != "" ? title : originalRaceData.title,
            track: track != "" ? track : originalRaceData.track,
            timestamp: timestamp,
            isSprint: isSprint,
            id: raceId,
        }

        const raceResponse = await submitEditRace(newRace);

        if(raceResponse.error || raceResponse.status != 201){
            setModalErrorMessage("There has been an error editing the race, make sure the data inputted is correct")
            return;
        }

        setSuccessMessage("Race edited");
        retrieveSeason();
        resetVariables();
        closeModal();
    }

    useEffect(() => {
        async function retrieve(){
            setRaceEditLoading(true);
            await retrieveRaceDetails();
            setRaceEditLoading(false);
        }

        retrieve();
        
    }, [raceId])

    async function saveChanges(){
        await editRace();
    }

    if(raceEditLoading){
        return null;
    }

    return (
        <div className="custom-modal" id="race-edit-modal" onClick={(e) => {e.stopPropagation();}}>
            <div className="custom-modal-header justify-content-center">
                <h5>Edit Race</h5>
            </div>

            <hr />

            {modalErrorMessage && <div className="alert alert-danger"><small>{modalErrorMessage}</small></div>}

            <div className="custom-modal-body">
                {track == "" && <textarea rows={1} id="race-edit-track" className='input-field textarea-expand mt-2 w-100' data-category="input-field" placeholder="No track set" onKeyUp={(e) => {enterKeySubmit(e, saveChanges);setTrack(e.currentTarget.value)}} onChange={(e) => autoResizeTextarea(e.target)}></textarea>}
                {track != "" && <textarea rows={1} id="race-edit-track" className='input-field textarea-expand mt-2 w-100' data-category="input-field" placeholder={track} onKeyUp={(e) => {enterKeySubmit(e, saveChanges);setTrack(e.currentTarget.value)}} onChange={(e) => autoResizeTextarea(e.target)}></textarea>}
                {title == "" && <textarea rows={1} id="race-edit-title" className='input-field textarea-expand mt-2 w-100' data-category="input-field" placeholder="No title set" onKeyUp={(e) => {enterKeySubmit(e, saveChanges);setTitle(e.currentTarget.value)}} onChange={(e) => autoResizeTextarea(e.target)}></textarea>}
                {title != "" && <textarea rows={1} id="race-edit-title" className='input-field textarea-expand mt-2 w-100' data-category="input-field" placeholder={title} onKeyUp={(e) => {enterKeySubmit(e, saveChanges);setTitle(e.currentTarget.value)}} onChange={(e) => autoResizeTextarea(e.target)}></textarea>}
                <div className="d-flex justify-content-center">
                    <input id="race-edit-date" type="date" data-category="input-field" className="input-field flex-grow-1 mt-2" value={timestamp} onChange={(e) => setTimestamp(e.currentTarget.value)} onKeyUp={(e) => enterKeySubmit(e, saveChanges)}/>
                </div>
                <div className="form-check mt-1">
                    <input id="race-edit-sprint" type="checkbox" className="form-check-input" data-category="input-field" checked={isSprint} onChange={() => {setIsSprint(!isSprint)}} onKeyUp={(e) => enterKeySubmit(e, saveChanges)}/>
                    <label className="form-check-label" htmlFor="race-edit-sprint">Sprint Race</label>
                </div>
            </div>

            <div className="custom-modal-footer">
                <button className="btn btn-primary ms-auto" onClick={saveChanges}>Save changes</button>
            </div>
        </div>
    )
}