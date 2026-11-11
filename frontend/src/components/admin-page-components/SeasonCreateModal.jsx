import React, { useState } from "react"
import { useApplicationContext } from "../ApplicationContext";
import { submitSeason } from "../fetch-utils/fetchPost";
import { useSeasonCreateContext } from "./SeasonCreateContext";
import { useOpenersContext } from "../OpenersContext";

export default function SeasonCreateModal(){
    const currentYear = new Date().getFullYear();

    const { setErrorMessage, setSuccessMessage, resetApplicationMessages, setLoadingMessage, loadingMessage } = useApplicationContext();
    const { retrieveSeasons } = useSeasonCreateContext();
    const { closeModal } = useOpenersContext();

    const [seasonYear, setSeasonYear] = useState(currentYear);
    const [seasonTopIndependent, setSeasonTopIndependent] = useState(false);
    const [seasonTopRookie, setSeasonTopRookie] = useState(false);

    async function postSeason(){
        resetApplicationMessages();
        setLoadingMessage("Loading...");
        let seasonResponse = await submitSeason(seasonYear, seasonTopIndependent, seasonTopRookie);
        setLoadingMessage(false);

        if(seasonResponse.error){
            setErrorMessage("There was an error creating the season");
            return;
        }

        if(seasonResponse.status !== 200){
            setErrorMessage("Be sure the year of the season is unique");
            return;
        }

        setSuccessMessage("Season created");
        setSeasonYear(currentYear);
        setSeasonTopIndependent(false);
        setSeasonTopRookie(false);
        retrieveSeasons();
        closeModal();
    }

    function handleYearChange(event){
        const year = event.target.value;
        setSeasonYear(year);
    }

    function handleTopIndependentChange(event){
        const topIndependent = event.target.checked;
        setSeasonTopIndependent(topIndependent);
    }

    function handleTopRookieChange(event){
        const topRookie = event.target.checked;
        setSeasonTopRookie(topRookie);
    }

    return(
        <div className="custom-modal" id="season-create-modal" onClick={(e) => {e.stopPropagation()}}>
            <div className="custom-modal-header justify-content-center">  
                <h5>Create season</h5>
            </div>   
            <div className="custom-modal-body">
                <hr />
                <div className="d-flex justify-content-center w-100">
                    <input className="input-field" type="number" min="1900" max="2099" step="1" value={seasonYear} onChange={(e) => handleYearChange(e)} id="season-year" onKeyUp={(e) => enterKeySubmit(e, postSeason)} />
                    <div className="ms-2">
                        <div className="form-check">
                            <input className="form-check-input" id="season-top-independent" type="checkbox" data-category="input-field" onChange={(e) => handleTopIndependentChange(e)}/>
                            <label className="form-check-label" htmlFor="season-top-independent">Top Independent</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" id="season-top-rookie" type="checkbox" data-category="input-field" onChange={(e) => handleTopRookieChange(e)}/>
                            <label className="form-check-label" htmlFor="season-top-rookie">Top Rookie</label>
                        </div>
                    </div>
                </div>
                
            </div>
            <div className="custom-modal-footer justify-content-center">
                <button id="submit-data" className="btn btn-primary rounded-15 w-100" onClick={postSeason}>Create season</button>
            </div>
        </div>
    );
}