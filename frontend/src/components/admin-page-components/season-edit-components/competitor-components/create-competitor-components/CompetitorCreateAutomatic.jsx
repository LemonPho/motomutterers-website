import React, {useRef, useState} from "react";

import { submitSeasonCompetitorsLink } from "../../../../fetch-utils/fetchPost";
import { useApplicationContext } from "../../../../ApplicationContext";
import { useSeasonContext } from "../../SeasonContext";
import { useOpenersContext } from "../../../../OpenersContext";
import Textarea from "../../../../util-components/Textarea";

export default function CompetitorCreateAutomatic(){
    const { closeModal } = useOpenersContext();
    const { setErrorMessage, loadingMessage, setLoadingMessage, setSuccessMessage, resetApplicationMessages } = useApplicationContext();
    const { retrieveSeason, season } = useSeasonContext();

    const [link, setLink] = useState("");
    const linkInput = useRef(null);

    async function submitLink(){
        resetApplicationMessages();
        closeModal();
        setLoadingMessage("Loading: Reload page to view progress");

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

        linkInput.current.value = "";
        closeModal();
        retrieveSeason();
        setSuccessMessage("Riders successfully added");
    }

    return (
        <div id="competitor-create-standings-modal" className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header justify-content-center">
                <h5>Create rider automatic</h5>
            </div>

            <hr />

            <div className="custom-modal-body">
                <div className="alert alert-info"><small>Paste the link of the motogp.com standings page</small></div>
                <Textarea id="competitor-automatic-link" placeholder="Link..." value={link} setValue={setLink} onEnterFunction={submitLink}/>
            </div>

            <div className="custom-modal-footer">
                <button className="btn btn-primary rounded-15 w-100" onClick={submitLink}>Submit</button>
            </div>
        </div>
    )
}