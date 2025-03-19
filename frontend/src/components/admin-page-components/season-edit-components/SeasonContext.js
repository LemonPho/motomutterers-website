import React, { createContext, useContext, useEffect, useState } from "react";
import { getSeasonAdmin } from "../../fetch-utils/fetchGet";
import { Outlet, useParams } from "react-router-dom";
import { submitCompetitor, submitDeleteCompetitor, submitDeleteRace, submitEditSeasonCompetitor, submitEditRace, submitRace, submitRaceResults, submitDeleteSeason, submitEditRaceWeekend, submitDeleteRaceWeekend } from "../../fetch-utils/fetchPost";
import { useApplicationContext } from "../../ApplicationContext";
import { useSeasonCreateContext } from "../SeasonCreateContext";

const SeasonContext = createContext();

export default function SeasonContextProvider(){
    const { setErrorMessage, setSuccessMessage, setLoadingMessage, resetApplicationMessages, user, userLoading } = useApplicationContext();

    const seasonYear = useParams().seasonYear;
    const [season, setSeason] = useState(null);
    const [seasonLoading, setSeasonLoading] = useState(false);

    async function retrieveSeason(){
        if(userLoading) return null;
        const seasonResponse = await getSeasonAdmin(seasonYear, user);
        let tempSeason = {};

        if(seasonResponse.status === 404){
            setSeason(false);
            setSeasonLoading(false);
            setErrorMessage("Season not found");
            return;
        }

        if(seasonResponse.error || seasonResponse.status != 200){
            setErrorMessage("There was an error loading the season");
            setSeasonLoading(false);
            console.log(seasonResponse.error);
            return;
        }

        tempSeason = seasonResponse.season;
        tempSeason.competitorsSortedNumber = seasonResponse.competitorsSortedNumber;

        setSeason(tempSeason);
        setSeasonLoading(false);
    }

    async function deleteSeason(){
        const seasonResponse = await submitDeleteSeason(season.id);

        if(seasonResponse.status != 200 || seasonResponse.error){
            setErrorMessage("There was an error deleting the season");
            return;
        }

        setSuccessMessage("Season deleted");
        setSeason(null);
    }

    //-------------------------------------RACES--------------------------------------------//

    async function createSeasonRace(newRace){
        resetApplicationMessages();
        const raceResponse = await submitRace(newRace);

        if(raceResponse.error || raceResponse.status != 200){
            setErrorMessage("There was an error creating the race");
            console.log(raceResponse.error)
            return false;
        }

        setSuccessMessage("Race created");
        retrieveSeason();

        return true;
    }

    async function addSeasonRaceResults(newRace){
        resetApplicationMessages();
        const raceResponse = await submitRaceResults(newRace);

        if(raceResponse.error){
            setErrorMessage("There was an error adding the results");
            console.log(raceResponse.error);
            return false;
        }

        if(raceResponse.status != 200){
            setErrorMessage("Be sure that the information inputted is correct");
            return false;
        }

        setSuccessMessage("Race result saved");
        retrieveSeason();
        return true;
    }

    async function editSeasonRace(newRace){
        resetApplicationMessages();
        let raceResponse = await submitEditRace(newRace);

        if(raceResponse.error){
            setErrorMessage("There was an error editing the race")
            console.log(raceResponse.error)
            return false;
        }

        if(raceResponse.status != 200){
            setErrorMessage("Be sure the information is valid");
            return false;
        }

        setSuccessMessage("Changes saved");
        retrieveSeason();
        return true;
    }

    async function deleteSeasonRace(raceId){
        resetApplicationMessages();
        setLoadingMessage("Loading...");
        let raceResponse = await submitDeleteRace(raceId, seasonYear);

        if(raceResponse.error || raceResponse.status != 200){
            console.log(raceResponse.error);
            setErrorMessage("There was an error deleting the race");
            setErrorMessage("There was an error deleting the race");
            return;
        }

        setLoadingMessage(false);
        setSuccessMessage("Race deleted");
        retrieveSeason();

        return;
    }

    //---------------------------------COMPETITORS-----------------------------------------//

    async function createSeasonCompetitor(newCompetitorPosition){
        resetApplicationMessages();
        const competitorResponse = await submitCompetitor(newCompetitorPosition);

        if(competitorResponse.error){
            setErrorMessage("There was an error submiting the competitor");
            console.log(competitorResponse.error);
            return false;
        }

        if(competitorResponse.riderExists){
            setErrorMessage("A rider with that number already exists");
            return false;
        }

        if(competitorResponse.seasonNotFound){
            setErrorMessage("The season was not found of which you want to add the competitor")
            return false;
        }

        if(competitorResponse.status != 201){
            setErrorMessage("Make sure the information is correct and valid");
            return false;
        }

        setSuccessMessage("Rider created")
        retrieveSeason();
        return true;
    }

    async function editSeasonCompetitor(newCompetitor){
        resetApplicationMessages();
        const competitorResponse = await submitEditSeasonCompetitor(newCompetitor);

        if(competitorResponse.error){
            console.log(competitorResponse.error);
            setErrorMessage("There was an error editing the rider");
            return false;
        }

        if(competitorResponse.status != 200){
            setErrorMessage("Make sure the information is valid");
            return false;
        }

        setSuccessMessage("Changes saved");
        retrieveSeason();
        return true;
    }

    async function deleteSeasonCompetitor(competitorId, seasonId){
        resetApplicationMessages();
        const competitorResponse = await submitDeleteCompetitor(competitorId, seasonId);

        if(competitorResponse.error){
            setErrorMessage("There was an error deleting the rider");
            console.log(competitorResponse.error);
            return false;
        }

        if(competitorResponse.status == 422){
            setErrorMessage("The competitor is being used in picks or a race, please edit instead of deleting")
            return false;
        }

        if(competitorResponse.status != 200){
            setErrorMessage("There was an error deleting the competitor");
            return false;
        }

        setSuccessMessage("Rider deleted");
        retrieveSeason();
        return true;
    }

    return(
        <SeasonContext.Provider value={{ season, seasonLoading, setSeason, retrieveSeason, deleteSeason,
                                        createSeasonRace, addSeasonRaceResults, editSeasonRace, deleteSeasonRace, 
                                        createSeasonCompetitor, editSeasonCompetitor, deleteSeasonCompetitor, }}>
            <Outlet/>
        </SeasonContext.Provider>
    );
}

export function useSeasonContext(){
    return useContext(SeasonContext);
}