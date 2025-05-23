import React from "react";

import { useApplicationContext } from "../../../../ApplicationContext.js";

import CreateCompetitorManual from "./CompetitorCreateManual.js";
import CompetitorCreateAutomatic from "./CompetitorCreateAutomatic.js";
import { submitSeasonCompetitorsLink } from "../../../../fetch-utils/fetchPost.js";
import { useSeasonContext } from "../../SeasonContext.js";
import Modal from "../../../../util-components/Modal.js";
import { useOpenersContext } from "../../../../OpenersContext.js";

export default function CompetitorCreateModal(){
    const { modalErrorMessage, setErrorMessage, resetApplicationMessages, setLoadingMessage, loadingMessage, setSuccessMessage } = useApplicationContext();
    const { retrieveSeason, season } = useSeasonContext();
    const { openedModal, openModal, closeModal } = useOpenersContext();
    
    async function retrieveCompetitorsRiderList(){
        resetApplicationMessages();
        setLoadingMessage("Loading...");
        closeModal();

        let link = "https://www.motogp.com/en/riders/motogp";
        const competitorResponse = await submitSeasonCompetitorsLink(link, season.year);
        setLoadingMessage(false);

        if(competitorResponse.error){
            setErrorMessage("There was an error processing the riders, try again later");
            return;
        }

        if(competitorResponse.invalidLink){
            setErrorMessage("Incorrect link, be sure its coppied correctly");
            return;
        }

        if(competitorResponse.invalidSeason){
            setErrorMessage("Could not find the season in the database");
            return;
        }

        if(competitorResponse.timeout){
            setErrorMessage("MotoGP website didn't load");
            return;
        }

        if(competitorResponse.status == 400){
            setErrorMessage("There was an error adding the riders");
            return;
        }

        closeModal();
        retrieveSeason();
        setSuccessMessage("Riders successfully added");
    }

    return (
        <div className="ms-auto">
            <div className="custom-modal" id="competitor-create-modal" onClick={(e) => {e.stopPropagation()}}>
                <div className="custom-modal-body">
                    {modalErrorMessage && <div className="alert alert-danger"><small>{modalErrorMessage}</small></div>}
                    <div className="card rounded-15 clickable mb-2" onClick={() => {resetApplicationMessages();openModal("competitor-create-automatic")}}>
                        <div className="card-body">
                            <div className="d-flex justify-content-center">
                                <strong>Retrieve season riders through motogp standings page</strong>
                            </div>
                        </div>
                    </div>
                    <div className="card rounded-15 clickable mb-2" onClick={retrieveCompetitorsRiderList}>
                        <div className="card-body">
                            <div className="d-flex justify-content-center">
                                <strong>Retrieve season riders through motogp rider list</strong>
                            </div>
                        </div>
                    </div>
                    <div className="card rounded-15 clickable" onClick={() => {resetApplicationMessages();openModal("competitor-create-manual")}}>
                        <div className="card-body">
                            <div className="d-flex justify-content-center">
                                <strong>Create riders manually</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}