import React, { useState } from "react";
import { useApplicationContext } from "../../../ApplicationContext";
import { submitToggleSeasonFinalize } from "../../../fetch-utils/fetchPost";
import { useSeasonCreateContext } from "../../SeasonCreateContext";
import { useSeasonContext } from "../SeasonContext";
import { useOpenersContext } from "../../../OpenersContext";
import Textarea from "../../../util-components/Textarea";

export default function SeasonFinalizeModal(){
    const { setErrorMessage, setSuccessMessage } = useApplicationContext();
    const { season } = useSeasonContext();
    const { closeModal } = useOpenersContext();

    const [seasonFinalizeState, setSeasonFinalizeState] = useState(season.finalized);
    const [yearInput, setYearInput] = useState("");

    async function handleToggleSeasonFinalize(){
        if(yearInput != season.year){
            setErrorMessage("The year inputted is not correct");
            return;
        }

        const toggleSeasonFinalizeResponse = await submitToggleSeasonFinalize(season.year);
        
        if(toggleSeasonFinalizeResponse.error){
            setErrorMessage("There was an error finalizing the season");
            return;
        }

        if(toggleSeasonFinalizeResponse.status == 200){
            setSuccessMessage("Successfully finalized the season");
            setSeasonFinalizeState(true);
            closeModal();
            return;
        }

        setErrorMessage("There was a problem finalizing the season");
    }

    return(
        <div className="custom-modal" id="finalize-season-modal" onClick={(e) => {e.stopPropagation()}}>
            <div className="custom-modal-header justify-content-center">
                <h5>Are you sure you want to finalize the season? This can't be reversed</h5>
            </div>
            <div className="custom-modal-body">
                <Textarea type="text" className="input-field w-100" placeholder="Input the season year to finalize..." value={yearInput} setValue={setYearInput} onInput={(e) => setYearInput(e.target.value)}/>
            </div>
            <div className="custom-modal-footer d-flex flex-column">
                <button className="btn btn-danger rounded-15 w-100 mb-2" onClick={(e) => {handleToggleSeasonFinalize()}}>Finalize</button>
                <button className="btn btn-light rounded-15 w-100" onClick={(e) => {closeModal()}}>Cancel</button>
            </div>
        </div>
    )
}