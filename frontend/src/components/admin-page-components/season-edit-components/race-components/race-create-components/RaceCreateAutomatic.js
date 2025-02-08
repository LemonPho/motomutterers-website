import React, {useState} from "react";

import { closeDropdowns, closeModals, enterKeySubmit, toggleDropdown, toggleModal, focusDiv, autoResizeTextarea } from "../../../../utils.js";
import { useApplicationContext } from "../../../../ApplicationContext.js";
import { useSeasonContext } from "../../SeasonContext.js"; 
import { submitRaceResultLink } from "../../../../fetch-utils/fetchPost.js";
import { useRaceCreateContext } from "./RaceCreateContext.js";


export default function RaceCreateAutomatic(){
    const { setErrorMessage, setSuccessMessage, setLoadingMessage, resetApplicationMessages } = useApplicationContext();
    const { season, retrieveSeason } = useSeasonContext();
    const { link, raceDate, raceType, setLink, setRaceDate, setRaceType } = useRaceCreateContext();

    function handleDateChange(event){
        const newDate = event.target.value;
        setRaceDate(newDate);
    }

    function handleRaceTypeChange(event){
        setRaceType(event.target.value);
    }

    function handleLinkChange(event){
        setLink(event.target.value);
    }

    async function submitLink(){
        resetApplicationMessages();
        setLoadingMessage("Loading...");

        let raceResponse = await submitRaceResultLink(link, raceDate, raceType, season.year);
        setLoadingMessage(false);

        if(raceResponse.error){
            setErrorMessage("There was an error processing the link.");
            console.log(raceResponse.error);
            return;
        }

        if(raceResponse.invalidLink){
            setErrorMessage("The link is invalid or website didn't load.");
            return;
        }

        if(raceResponse.competitorNumbersNotFound.length > 0){
            let string = "Competitors with the numbers: ";
            for(let i = 0; i < raceResponse.competitorNumbersNotFound.length; i++){
                string += String(raceResponse.competitorNumbersNotFound[i]);
                string += " ";
            }

            string += "were not found in the database";

            setErrorMessage(string);
            return;
        }

        if(raceResponse.timeout){
            setErrorMessage("Motosport website didn't load, try again later");
            return;
        }

        if(raceResponse.invalidSeason){
            setErrorMessage("Season was not found in the database");
            return;
        }

        if(raceResponse.invalidType){
            setErrorMessage("Race type was not valid (Upcoming, Final, Sprint)");
            return;
        }

        if(raceResponse.status != 201){
            setErrorMessage("There was an error processing the link.");
            return;
        }

        closeModals();
        setLoadingMessage(false);
        setSuccessMessage("The race has been submited");
        retrieveSeason();
    }

    return (
        <div className="custom-modal hidden" id="race-create-automatic-modal" onClick={(e) => {e.stopPropagation()}}>
            <div className="custom-modal-header justify-content-center">
                <h5>Create Race Automatic</h5>
            </div>

            <hr />
            
            <div className="custom-modal-body">
                <div className="alert alert-info"><small>Open the race result on motorsport.com and then paste the link into the textbox</small></div>
                <textarea rows={1} className="input-field textarea-expand w-100" id="race-automatic-link" role="textbox" placeholder="Link..." data-category="input-field" onInput={(e) => {handleLinkChange(e)}} onClick={(e) => {focusDiv("race-automatic-link");e.stopPropagation()}} onKeyUp={(e) => {enterKeySubmit(e, submitLink)}} onChange={(e) => autoResizeTextarea(e.target)}></textarea>
                <div className="d-flex justify-content-center align-items-center mt-2">
                    <input id="race-automatic-date" type="date" className="input-field" data-category="input-field" onChange={(e) => handleDateChange(e)} onKeyUp={(e) => {enterKeySubmit(e, submitLink)}}/>
                    <select className="input-field ms-2" data-category="input-field" onChange={(e) => {handleRaceTypeChange(e)}}>
                        <option value={1}>Upcoming Race</option>
                        <option value={2}>Finalized Race</option>
                        <option value={3}>Sprint Race</option>
                    </select>
                </div>
                
            </div>

            <div className="custom-modal-footer">
                <button className="btn btn-primary rounded-15 w-100" onClick={submitLink}>Submit</button>
            </div>
            
        </div>
    )
}