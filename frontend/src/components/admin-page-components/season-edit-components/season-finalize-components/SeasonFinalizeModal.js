import React, { useState } from "react";
import { useApplicationContext } from "../../../ApplicationContext";
import { submitToggleSeasonFinalize } from "../../../fetch-utils/fetchPost";
import { useSeasonCreateContext } from "../../SeasonCreateContext";
import { useSeasonContext } from "../SeasonContext";

export default function SeasonFinalizeModal(){
    const { setErrorMessage, setSuccessMessage } = useApplicationContext();
    const { season } = useSeasonContext();

    const [seasonFinalizeState, setSeasonFinalizeState] = useState(season.finalized);

    async function handleToggleSeasonFinalize(){
        const toggleSeasonFinalizeResponse = await submitToggleSeasonFinalize(season.year);
        
        if(toggleSeasonFinalizeResponse.error){
            setErrorMessage("There was an error finalizing the season");
            return;
        }

        if(toggleSeasonFinalizeResponse.status == 200){
            setSuccessMessage("Successfully finalized the season");
            setSeasonFinalizeState(true);
            return;
        }

        setErrorMessage("There was a problem finalizing the season");
    }

    return(
        <div className="custom-modal" id="finalize-season-modal" onClick={(e) => {e.stopPropagation()}}>
            <div className="custom-modal-header justify-content-center">
                <h5>Are you sure you want to finalize the season? This can't be reversed</h5>
            </div>
            <div className="custom-modal-footer">
                <button className="btn btn-danger" onClick={(e) => {handleToggleSeasonFinalize(); toggleModal("finalize-season-modal", e)}}>Finalize</button>
                <button className="ms-auto btn btn-primary" onClick={(e) => {toggleModal("finalize-season-modal", e)}}>Cancel</button>
            </div>
        </div>
    )
}