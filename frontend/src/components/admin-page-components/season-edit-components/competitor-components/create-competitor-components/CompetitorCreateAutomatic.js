import React, {useState} from "react";

import { focusDiv, enterKeySubmit, closeModals } from "../../../../utils";
import { submitSeasonCompetitorsLink } from "../../../../fetch-utils/fetchPost";
import { useApplicationContext } from "../../../../ApplicationContext";
import { useSeasonContext } from "../../SeasonContext";

export default function CompetitorCreateAutomatic(){

    const { modalErrorMessage, setModalErrorMessage, loadingMessage, setLoadingMessage, setSuccessMessage, resetApplicationMessages } = useApplicationContext();
    const { retrieveSeason, season } = useSeasonContext();

    async function submitLink(){
        resetApplicationMessages();
        setLoadingMessage("Loading...");

        let link = document.getElementById("competitor-automatic-link").innerHTML;
        const competitorResponse = await submitSeasonCompetitorsLink(link, season.year);
        setLoadingMessage(false);

        if(competitorResponse.error){
            setModalErrorMessage("There was an error processing the riders, try again later");
            return;
        }

        if(competitorResponse.invalidLink){
            setModalErrorMessage("Incorrect link, be sure its coppied correctly");
            return;
        }

        if(competitorResponse.invalidSeason){
            setModalErrorMessage("Could not find the season in the database");
            return;
        }

        if(competitorResponse.timeout){
            setModalErrorMessage("MotoGP website didn't load");
            return;
        }

        if(competitorResponse.status == 400){
            setModalErrorMessage("There was an error adding the riders");
            return;
        }

        closeModals();
        retrieveSeason();
        setSuccessMessage("Riders successfully added");
    }

    return (
        <div id="competitor-create-standings-modal" className="custom-modal hidden" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header justify-content-center">
                <h5>Create competitor automatic</h5>
            </div>

            <hr />

            <div className="custom-modal-body">
                <div className="alert alert-info"><small>Paste the link of the motogp.com standings page</small></div>
                {modalErrorMessage && <div className="alert alert-danger"><small>{modalErrorMessage}</small></div>}
                {loadingMessage && <div className="alert alert-secondary"><small>{loadingMessage}</small></div>}
                <div className="input-field" id="competitor-automatic-link" contentEditable={true} role="textbox" data-placeholder="Link..." data-category="input-field" onClick={(e) => {focusDiv("competitor-automatic-link");e.stopPropagation()}} onKeyUp={(e) => {enterKeySubmit(e, submitLink)}}></div>
            </div>

            <div className="custom-modal-footer">
                <button className="btn btn-primary" onClick={submitLink}>Submit</button>
            </div>
        </div>
    )
}