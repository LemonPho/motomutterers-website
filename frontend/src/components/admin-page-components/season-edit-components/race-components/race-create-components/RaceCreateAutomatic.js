import React, {useState} from "react";

import { closeDropdowns, closeModals, enterKeySubmit, toggleDropdown, toggleModal, focusDiv } from "../../../../utils.js";
import { useApplicationContext } from "../../../../ApplicationContext.js";
import { useSeasonContext } from "../../SeasonContext.js"; 
import { submitRaceResultLink } from "../../../../fetch-utils/fetchPost.js";


export default function RaceCreateAutomatic(){
    const { modalErrorMessage, setModalErrorMessage, setSuccessMessage, setLoadingMessage, loadingMessage, resetApplicationMessages } = useApplicationContext();
    const { season, retrieveSeason } = useSeasonContext();

    const[raceDate, setRaceDate] = useState();

    function handleDateChange(event){
        const newDate = event.target.value;
        setRaceDate(newDate);
    }

    async function submitLink(){
        resetApplicationMessages();
        setLoadingMessage("Loading...");

        let link = document.getElementById("race-automatic-link").innerHTML;
        let raceResponse = await submitRaceResultLink(link, raceDate, season.year);
        setLoadingMessage(false);

        if(raceResponse.error){
            setModalErrorMessage("There was an error processing the link.");
            console.log(raceResponse.error);
            return;
        }

        if(raceResponse.invalidLink){
            setModalErrorMessage("The link is invalid or website didn't load.");
            return;
        }

        if(raceResponse.competitorNumbersNotFound.length > 0){
            let string = "Competitors with the numbers: ";
            for(let i = 0; i < raceResponse.competitorNumbersNotFound.length; i++){
                string += String(raceResponse.competitorNumbersNotFound[i]);
                string += " ";
            }

            string += "were not found in the database";

            setModalErrorMessage(string);
            return;
        }

        if(raceResponse.timeout){
            setModalErrorMessage("Motosport website didn't load, try again later");
            return;
        }

        if(raceResponse.invalidSeason){
            setModalErrorMessage("Season was not found in the database")
            return;
        }

        if(raceResponse.status != 201){
            setModalErrorMessage("There was an error processing the link.");
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
                {modalErrorMessage && <div className="alert alert-danger"><small>{modalErrorMessage}</small></div>}
                {loadingMessage && <div className="alert alert-secondary"><small>{loadingMessage}</small></div>}
                <div className="alert alert-info"><small>Open the race result on motorsport.com and then paste the link into the textbox</small></div>
                <div className="input-field" id="race-automatic-link" contentEditable={true} role="textbox" data-placeholder="Link..." data-category="input-field" onClick={(e) => {focusDiv("race-automatic-link");e.stopPropagation()}} onKeyUp={(e) => {enterKeySubmit(e, submitLink)}}></div>
                <div className="d-flex justify-content-center align-items-center mt-2">
                    <input id="race-automatic-date" type="date" className="input-field" data-category="input-field" onChange={(e) => handleDateChange(e)} onKeyUp={(e) => {enterKeySubmit(e, submitLink)}}/>
                </div>
                
            </div>

            <div className="custom-modal-footer">
                <button className="btn btn-primary rounded-15" onClick={submitLink}>Submit</button>
            </div>
            
        </div>
    )
}