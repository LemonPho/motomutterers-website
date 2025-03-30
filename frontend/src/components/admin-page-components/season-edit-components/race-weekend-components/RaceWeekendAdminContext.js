import React, { createContext, useContext, useState } from "react";
import { useApplicationContext } from "../../../ApplicationContext";
import { useSeasonContext } from "../SeasonContext";
import { submitCreateRaceWeekend, submitDeleteRaceWeekend, submitEditRaceWeekend, submitFinalizeRaceWeekend, submitRaceWeekendEvent, submitUnFinalizeRaceWeekend } from "../../../fetch-utils/fetchPost";
import { useOpenersContext } from "../../../OpenersContext";
import { getRaceWeekendAdmin } from "../../../fetch-utils/fetchGet";

const RaceWeekendAdminContext = createContext();

export default function RaceWeekendAdminContextProvider({ children }){
    const { setErrorMessage, setSuccessMessage, resetApplicationMessages, setLoadingMessage } = useApplicationContext();
    const { retrieveSeason } = useSeasonContext();
    const { closeModal } = useOpenersContext();

    const [selectedRaceWeekend, setSelectedRaceWeekend] = useState();
    const [selectedRaceWeekendLoading, setSelectedRaceWeekendLoading] = useState();

    async function retrieveRaceWeekend(raceWeekendId){
        setSelectedRaceWeekendLoading(true);
        const raceWeekendResponse = await getRaceWeekendAdmin(raceWeekendId);

        if(raceWeekendResponse.error || raceWeekendResponse.status != 200){
            setErrorMessage("There was an error retrieving the race weekend data");
            setSelectedRaceWeekendLoading(false);
            return;
        }

        setSelectedRaceWeekend(raceWeekendResponse.raceWeekend);
        setSelectedRaceWeekendLoading(false);
    }

    async function retrieveRaceWeekendEvent(eventType){
        resetApplicationMessages();
        setLoadingMessage("Loading...");
        const raceWeekendResponse = await submitRaceWeekendEvent(selectedRaceWeekend.id, eventType);
        setLoadingMessage(false);
        if(raceWeekendResponse.error){
            setErrorMessage("There was an error retrieving the race weekend event");
            return;
        }

        if(raceWeekendResponse.competitorsNotFound.length > 0){
            let string = "Competitors with the numbers: ";
            for(let i = 0; i < raceWeekendResponse.competitorsNotFound.length; i++){
                string += String(raceWeekendResponse.competitorsNotFound[i]);
                string += " ";
            }

            string += "were not found in the database";

            setErrorMessage(string);
            return;
        }

        if(raceWeekendResponse.timeout){
            setErrorMessage("Didn't receive a response from motorsport.com")
            return;
        }

        if(raceWeekendResponse.seleniumBusy){
            setErrorMessage("There is already an instance of some sort of retrieval, please wait or terminate the process before trying again");
            return;
        }

        if(raceWeekendResponse.status != 201){
            setErrorMessage("There was a problem retrieving the race weekend event");
            return;
        }

        retrieveRaceWeekend(selectedRaceWeekend.id);
        setSuccessMessage("Race weekend event was successfully retrieved");
        retrieveSeason();
    }

    async function postRaceWeekend(newRaceWeekend){
        resetApplicationMessages();
        setLoadingMessage("Loading...");
        const raceWeekendResponse = await submitCreateRaceWeekend(newRaceWeekend);

        if(raceWeekendResponse.error || raceWeekendResponse.status != 201){
            setErrorMessage("There was an error creating the race weekend");
            setLoadingMessage(false);
            return;
        }

        setLoadingMessage(false);
        setSuccessMessage("Race weekend created");
        retrieveSeason();
        closeModal();
    }

    async function deleteRaceWeekend(raceWeekendId){
        resetApplicationMessages();
        setLoadingMessage("Loading...");
        const raceWeekendResponse = await submitDeleteRaceWeekend(raceWeekendId);

        if(raceWeekendResponse.status == 404){
            setErrorMessage("The race weekend was not found");
            setLoadingMessage(false);
            return;
        }

        if(raceWeekendResponse.error || raceWeekendResponse.status != 201){
            setErrorMessage("There was an error while deleting the race weekend");
            setLoadingMessage(false);
            return;
        }

        setSuccessMessage("Race weekend deleted");
        setLoadingMessage(false);
        retrieveSeason();
        closeModal();
    }

    async function editRaceWeekend(newRaceWeekend){
        resetApplicationMessages();
        setLoadingMessage("Loading...");
        const raceWeekendResponse = await submitEditRaceWeekend(newRaceWeekend);

        if(raceWeekendResponse.error){
            setErrorMessage("There was an error submiting the new race weekend");
            setLoadingMessage(false);
            return;
        }

        if(raceWeekendResponse.status == 404){
            setErrorMessage("The race weekend was not found");
            setLoadingMessage(false);
            return;
        }

        if(raceWeekendResponse.status != 201){
            setErrorMessage("There was an error submiting the edits to the race weekend");
            setLoadingMessage(false);
            return;
        }

        setSuccessMessage("Race weekend successfully edited");
        setLoadingMessage(false);
        retrieveSeason();
        closeModal();
    }

    async function postFinalizeRaceWeekend(){
        resetApplicationMessages();
        setLoadingMessage("Loading...");

        const raceWeekendResponse = await submitFinalizeRaceWeekend(selectedRaceWeekend.id);
        setLoadingMessage(false);

        if(raceWeekendResponse.error){
            setErrorMessage("There was an error finalizing the race weekend");
            
            return;
        }

        if(raceWeekendResponse.competitorsNotFound.length > 0){
            let string = "Competitors with the numbers: ";
            for(let i = 0; i < raceWeekendResponse.competitorsNotFound.length; i++){
                string += String(raceWeekendResponse.competitorsNotFound[i]);
                string += " ";
            }

            string += "were not found in the database";

            setErrorMessage(string);
            
            return;
        }

        if(raceWeekendResponse.cantBeFinalized){
            setErrorMessage("Make sure both the sprint race and race are retrieved before finalizing");
            return;
        }

        if(raceWeekendResponse.status == 404){
            setErrorMessage("The race weekend was not found");
            
            return;
        }

        if(raceWeekendResponse.status != 201){
            setErrorMessage("There was an error finalizing the race weekend");
            
            return;
        }

        let temporaryRaceWeekend = selectedRaceWeekend;
        temporaryRaceWeekend.status = 2;
        setSelectedRaceWeekend(temporaryRaceWeekend);
        setSuccessMessage("Race weekend finalized");
        retrieveSeason();
    }

    async function postUnFinalizeRaceWeekend(){
        resetApplicationMessages();
        setLoadingMessage("Loading...");

        const raceWeekendResponse = await submitUnFinalizeRaceWeekend(selectedRaceWeekend.id);
        setLoadingMessage(false);

        if(raceWeekendResponse.error){
            setErrorMessage("There was an error trying to un finalize the race weekend");
            return;
        }

        if(raceWeekendResponse.status == 404){
            setErrorMessage("The race weekend was not found");
            return;
        }

        if(raceWeekendResponse.status != 201){
            setErrorMessage("There was an error trying to un finalize the race weekend");
            return;
        }

        setSuccessMessage("Race weekend successfully unfinalized");
        let temporaryRaceWeekend = selectedRaceWeekend;
        temporaryRaceWeekend.status = 1;
        setSelectedRaceWeekend(temporaryRaceWeekend);
        retrieveSeason();
        return;
    }

    return(
        <RaceWeekendAdminContext.Provider value={{
            postRaceWeekend, deleteRaceWeekend, editRaceWeekend, retrieveRaceWeekendEvent, setSelectedRaceWeekend,
            selectedRaceWeekend, selectedRaceWeekendLoading, retrieveRaceWeekend, postFinalizeRaceWeekend, postUnFinalizeRaceWeekend,
        }}>

            {children}
        </RaceWeekendAdminContext.Provider>
    )
}

export function useRaceWeekendAdminContext(){
    return useContext(RaceWeekendAdminContext);
}