import React, {useState} from "react";

import { closeDropdowns, closeModals, enterKeySubmit, toggleDropdown, toggleModal, focusDiv } from "../../../../utils.js";
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
        setLink(event.target.innerHTML);
    }

    async function submitLink(){
        resetApplicationMessages();
        closeModals();
        setLoadingMessage("Loading: Reload to view the progress of the retrieval");

        let raceResponse = await submitRaceResultLink(link, raceDate, raceType, season.year);

        if(raceResponse.error){
            setErrorMessage("There was an error processing the link.");
            setLoadingMessage(false);
            console.log(raceResponse.error);
            return;
        }

        if(raceResponse.invalidLink){
            setErrorMessage("The link is invalid or website didn't load.");
            setLoadingMessage(false);
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
            setLoadingMessage(false);
            return;
        }

        if(raceResponse.timeout){
            setErrorMessage("Motosport website didn't load, try again later");
            setLoadingMessage(false);
            return;
        }

        if(raceResponse.invalidSeason){
            setErrorMessage("Season was not found in the database");
            setLoadingMessage(false);
            return;
        }

        if(raceResponse.invalidType){
            setErrorMessage("Race type was not valid (Upcoming, Final, Sprint)");
            setLoadingMessage(false);
            return;
        }

        if(!raceResponse.seleniumAvailable){
            setErrorMessage("Please wait for another retrieval to finish, if there shouldn't be any other retrieval happening contact admin");
            setLoadingMessage(false);
            return;
        }

        if(raceResponse.status != 201){
            setErrorMessage("There was an error processing the link.");
            setLoadingMessage(false);
            return;
        }

        setLoadingMessage(false);
        closeModals();
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
                <div className="input-field" id="race-automatic-link" contentEditable={true} role="textbox" data-placeholder="Link..." data-category="input-field" onInput={(e) => {handleLinkChange(e)}} onClick={(e) => {focusDiv("race-automatic-link");e.stopPropagation()}} onKeyUp={(e) => {enterKeySubmit(e, submitLink)}}></div>
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