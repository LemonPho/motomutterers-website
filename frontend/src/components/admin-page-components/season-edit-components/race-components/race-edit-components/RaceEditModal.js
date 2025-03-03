import React, { useEffect, useState } from "react";
import { useApplicationContext } from "../../../../ApplicationContext";
import { autoResizeTextarea, enterKeySubmit } from "../../../../utils";
import { useSeasonContext } from "../../SeasonContext";
import { getRace } from "../../../../fetch-utils/fetchGet";
import { submitDeleteRace, submitEditRace } from "../../../../fetch-utils/fetchPost";
import { useOpenersContext } from "../../../../OpenersContext";
import Textarea from "../../../../util-components/Textarea";
 
export default function RaceEditModal({ raceId }){
    const { setErrorMessage, setSuccessMessage, resetApplicationMessages } = useApplicationContext();
    const { retrieveSeason, season } = useSeasonContext();
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
            setErrorMessage("There was an error retrieving the race data");
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
            setErrorMessage("There has been an error editing the race, make sure the data inputted is correct")
            return;
        }

        setSuccessMessage("Race edited");
        retrieveSeason();
        resetVariables();
        closeModal();
    }

    async function deleteRace(){
        const raceResponse = await submitDeleteRace(raceId, season.year);

        if(raceResponse.error || raceResponse.status != 200){
            setErrorMessage("There was an error deleting the race");
            return;
        }

        setSuccessMessage("Race deleted");
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

            <div className="custom-modal-body">
                {track == "" && <Textarea id="race-edit-track" className="mt-2" data-category="input-field" placeholder="No track set" value={track} setValue={setTrack} onEnterFunction={saveChanges}/>}
                {track != "" && <Textarea id="race-edit-track" className="mt-2" data-category="input-field" placeholder={track} value={track} setValue={setTrack} onEnterFunction={saveChanges}/>}
                {title == "" && <Textarea id="race-edit-title" className="mt-2" data-category="input-field" placeholder="No title set" value={title} setValue={setTitle} onEnterFunction={saveChanges}/>}
                {title != "" && <Textarea id="race-edit-title" className="mt-2" data-category="input-field" placeholder={title} value={title} setValue={setTitle} onEnterFunction={saveChanges}/>}
                <div className="d-flex justify-content-center">
                    <input id="race-edit-date" type="date" data-category="input-field" className="input-field flex-grow-1 mt-2" value={timestamp} onChange={(e) => setTimestamp(e.currentTarget.value)} onKeyUp={(e) => enterKeySubmit(e, saveChanges)}/>
                </div>
                <div className="form-check mt-1">
                    <input id="race-edit-sprint" type="checkbox" className="form-check-input" data-category="input-field" checked={isSprint} onChange={() => {setIsSprint(!isSprint)}} onKeyUp={(e) => enterKeySubmit(e, saveChanges)}/>
                    <label className="form-check-label" htmlFor="race-edit-sprint">Sprint Race</label>
                </div>
            </div>

            <div className="custom-modal-footer d-flex flex-column">
                <button className="btn btn-primary rounded-15 w-100" onClick={saveChanges}>Save changes</button>
                <button className="btn btn-outline-danger rounded-15 w-100" onClick={deleteRace}>Delete</button>
            </div>
        </div>
    )
}