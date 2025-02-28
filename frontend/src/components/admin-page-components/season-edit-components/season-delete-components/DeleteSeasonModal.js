import React, { useState } from "react";
import { useSeasonContext } from "../SeasonContext";
import { useOpenersContext } from "../../../OpenersContext";
import { useApplicationContext } from "../../../ApplicationContext";
import { useNavigate } from "react-router-dom";

export default function DeleteSeasonModal(){
    const { setErrorMessage } = useApplicationContext();
    const { closeModal } = useOpenersContext();
    const { season, deleteSeason } = useSeasonContext();

    const navigate = useNavigate();

    const [yearInput, setYearInput] = useState("");

    async function deleteSeasonConfirm(){
        if(yearInput != season.year){
            setErrorMessage("The season year is not correct");
            return;
        }

        await deleteSeason();
        closeModal();
        navigate("/administration");
    }

    return(
        <div className="custom-modal" id="season-delete-modal" onClick={(e) => {e.stopPropagation();}}>
            <div className="custom-modal-header justify-content-center">
                <h5>Delete Season</h5>
            </div>
            <div className="custom-modal-body">
                <input type="text" className="input-field w-100" placeholder="Write the season year" onChange={(e) => {setYearInput(e.target.value)}}/>
            </div>
            <div className="custom-modal-footer d-flex flex-column">
                <button className="btn btn-danger w-100 rounded-15" onClick={deleteSeasonConfirm}>Delete Season</button>
                <button className="btn btn-light w-100 rounded-15 mt-2" onClick={() => closeModal()}>Cancel</button>
            </div>
        </div>
    )
}