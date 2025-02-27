import React, { useState } from "react";
import { useApplicationContext } from "../ApplicationContext";
import { useModalsContext } from "../ModalsContext";
import { submitDeleteSeason } from "../fetch-utils/fetchPost";
import { useSeasonCreateContext } from "./SeasonCreateContext";

export default function SeasonDeleteModal({ selectedSeason }){
    const { closeModal } = useModalsContext();
    const { resetApplicationMessages, setErrorMessage, setSuccessMessage } = useApplicationContext();
    const { retrieveSeasons } = useSeasonCreateContext();

    const [yearInput, setYearInput] = useState(0);

    async function deleteSeason(event){
        resetApplicationMessages();
        event.stopPropagation();

        if(yearInput != selectedSeason.year){
            setErrorMessage("Make sure the inputted year is correct");
            return;
        }

        let deleteResponse = await submitDeleteSeason(selectedSeason.id);

        if(deleteResponse.error){
            setErrorMessage("There was an error deleting the season");
            return;
        }

        if(deleteResponse.status == 200){
            closeModal();
            retrieveSeasons();
            setSuccessMessage("Season deleted");
        }

        
    }

    return(
        <div className="custom-modal" id="season-delete-modal" onClick={(e) => {e.stopPropagation();}}>
            <div className="custom-modal-header justify-content-center">  
                <h5>Are you sure you want to delete this season?</h5>
            </div>   
            <div className="custom-modal-body">
                <input type="text" className="input-field w-100" placeholder="Write the season year" onChange={(e) => {setYearInput(e.target.value)}}/>
            </div>
            <div className="custom-modal-footer d-flex flex-column">
                <button id="season-confirm-delete" className="btn btn-outline-danger me-auto rounded-15 w-100" onClick={(e) => deleteSeason(e)}>Confirm</button>
                <button id="season-cancel-delete" className="btn btn-primary rounded-15 mt-2 w-100" onClick={() => closeModal()}>Cancel</button>
            </div>
        </div>
    )
}