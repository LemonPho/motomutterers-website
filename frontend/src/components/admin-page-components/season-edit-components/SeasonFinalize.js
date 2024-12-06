import React, { useState, useEffect } from "react";
import { useSeasonContext } from "./SeasonContext";
import { useApplicationContext } from "../../ApplicationContext";
import { submitToggleSeasonFinalize } from "../../fetch-utils/fetchPost";
import { toggleModal } from "../../utils";

export default function SeasonFinalize() {
    const { season } = useSeasonContext();
    const { setErrorMessage, setSuccessMessage, selectPicksState, contextLoading } = useApplicationContext();
    const [ seasonFinalizeState, setSeasonFinalizeState ] = useState(season.finalized); 

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

    if(contextLoading){
        return null;
    }

    return (
        <div className="d-flex align-items-center w-100">
            <strong>Finalize Season</strong>
            {seasonFinalizeState && 
            <div className="form-check form-switch ms-auto mb-0">
                <input className="form-check-input" type="checkbox" checked={seasonFinalizeState} disabled/>
            </div>
            }
            {!seasonFinalizeState && 
            <div className="form-check form-switch ms-auto mb-0">
                <input className="form-check-input" type="checkbox" checked={seasonFinalizeState} onChange={(e) => {toggleModal("finalize-season-modal", e)}}/>
            </div>
            }

            <div className="custom-modal hidden" id="finalize-season-modal" onClick={(e) => {e.stopPropagation()}}>
                <div className="custom-modal-header justify-content-center">
                    <h5>Are you sure you want to finalize the season? This can't be reversed</h5>
                </div>
                <div className="custom-modal-footer">
                    <button className="btn btn-danger" onClick={(e) => {handleToggleSeasonFinalize(); toggleModal("finalize-season-modal", e)}}>Finalize</button>
                    <button className="ms-auto btn btn-primary" onClick={(e) => {toggleModal("finalize-season-modal", e)}}>Cancel</button>
                </div>
            </div>
            
        </div>
    );
}