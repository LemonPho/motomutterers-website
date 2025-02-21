import React from "react";
import { useApplicationContext } from "../ApplicationContext";
import { useModalsContext } from "../ModalsContext";
import { submitDeleteSeason } from "../fetch-utils/fetchPost";
import { useSeasonCreateContext } from "./SeasonCreateContext";

export default function SeasonDeleteModal({ selectedSeason }){
    const { closeModal } = useModalsContext();
    const { resetApplicationMessages, setErrorMessage, setSuccessMessage } = useApplicationContext();
    const { retrieveSeasons } = useSeasonCreateContext();

    async function deleteSeason(event){
        resetApplicationMessages();
        event.stopPropagation();

        let deleteResponse = await submitDeleteSeason(selectedSeason);

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
                <hr />
            </div>
            <div className="custom-modal-footer">
                <button id="season-confirm-delete" className="btn btn-danger me-auto rounded-15" onClick={(e) => deleteSeason(e)}>Confirm</button>
                <button id="season-cancel-delete" className="btn btn-secondary ms-auto rounded-15" onClick={() => closeModal()}>Cancel</button>
            </div>
        </div>
    )
}