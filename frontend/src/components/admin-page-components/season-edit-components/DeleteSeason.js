import React, { useEffect, useState } from "react";
import { useSeasonContext } from "./SeasonContext";
import { closeModals, toggleModal } from "../../utils";
import { useApplicationContext } from "../../ApplicationContext";
import { useNavigate } from "react-router-dom";

export default function DeleteSeason(){
    const { season, deleteSeason } = useSeasonContext();
    const { user, setErrorMessage, retrieveCurrentSeason } = useApplicationContext();

    const [ seasonYearInput, setSeasonYearInput ] = useState("");

    const navigate = useNavigate();

    async function deleteSeasonConfirm(){
        if(seasonYearInput != season.year){
            setErrorMessage("The season year is not correct");
            return;
        }

        await deleteSeason();
        closeModals();
        navigate("/administration");
    }

    function handleYearChange(e){
        setSeasonYearInput(e.target.value);
    }


    return(
        <>
            <div className="d-flex align-items-center w-100 ps-1">
                <strong>Delete season</strong>
                <div className="ms-auto">
                    <button className="btn btn-outline-danger rounded-15" onClick={(e) => {toggleModal("season-delete-modal", e, user.is_logged_in, user.is_admin);setSeasonYearInput("")}}>
                        Delete season
                    </button>
                </div>
            </div>
            <div className="custom-modal hidden" id="season-delete-modal" onClick={(e) => {e.stopPropagation();}}>
                <div className="custom-modal-header justify-content-center">
                    <h5>Delete Season</h5>
                </div>
                <div className="custom-modal-body">
                    <input type="text" className="input-field w-100" placeholder="Write the season year" onChange={(e) => {handleYearChange(e)}}/>
                </div>
                <div className="custom-modal-footer d-flex flex-column">
                    <button className="btn btn-danger w-100 rounded-15" onClick={deleteSeasonConfirm}>Delete Season</button>
                    <button className="btn btn-light w-100 rounded-15 mt-2" onClick={closeModals}>Cancel</button>
                </div>
            </div>
        </>    
    );
}