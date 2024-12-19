import React, { createContext, useContext, useEffect, useState } from "react";
import { getSeason } from "../../fetch-utils/fetchGet";
import { Outlet, useParams } from "react-router-dom";
import { submitCompetitor, submitDeleteCompetitor, submitDeleteRace, submitEditSeasonCompetitor, submitEditRace, submitRace, submitRaceResults } from "../../fetch-utils/fetchPost";
import { useApplicationContext } from "../../ApplicationContext";

const SeasonContext = createContext();

export default function SeasonContextProvider(){
    const { setErrorMessage, setSuccessMessage, setModalErrorMessage, resetApplicationMessages } = useApplicationContext();

    const seasonYear = useParams().seasonYear;
    const [season, setSeason] = useState(null);
    const [seasonLoading, setSeasonLoading] = useState(false);

    async function retrieveSeason(){
        const seasonResponse = await getSeason(seasonYear);
        let tempSeason = {};

        if(seasonResponse.status === 404){
            setSeason(false);
            setSeasonLoading(false);
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

    //-------------------------------------RACES--------------------------------------------//

    async function createSeasonRace(newRace){
        resetApplicationMessages();
        const raceResponse = await submitRace(newRace);

        if(raceResponse.error || raceResponse.status != 200){
            setModalErrorMessage("There was an error creating the race");
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
            setModalErrorMessage("There was an error adding the results");
            console.log(raceResponse.error);
            return false;
        }

        if(raceResponse.status != 200){
            setModalErrorMessage("Be sure that the information inputted is correct");
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
            setModalErrorMessage("There was an error editing the race")
            console.log(raceResponse.error)
            return false;
        }

        if(raceResponse.status != 200){
            setModalErrorMessage("Be sure the information is valid");
            return false;
        }

        setSuccessMessage("Changes saved");
        retrieveSeason();
        return true;
    }

    async function deleteSeasonRace(raceId){
        resetApplicationMessages();
        let raceResponse = await submitDeleteRace(raceId, seasonYear);

        if(raceResponse.error || raceResponse.status != 200){
            console.log(raceResponse.error);
            setModalErrorMessage("There was an error deleting the race");
            setErrorMessage("There was an error deleting the race");
            return;
        }

        setSuccessMessage("Race deleted");
        retrieveSeason();

        return;
    }

    //---------------------------------COMPETITORS-----------------------------------------//

    async function createSeasonCompetitor(newCompetitorPosition){
        resetApplicationMessages();
        const competitorResponse = await submitCompetitor(newCompetitorPosition);

        if(competitorResponse.error){
            setModalErrorMessage("There was an error submiting the competitor");
            console.log(competitorResponse.error);
            return false;
        }

        if(competitorResponse.riderExists){
            setModalErrorMessage("A rider with that number already exists");
            return false;
        }

        if(competitorResponse.seasonNotFound){
            setModalErrorMessage("The season was not found of which you want to add the competitor")
            return false;
        }

        if(competitorResponse.status != 201){
            setModalErrorMessage("Make sure the information is correct and valid");
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
            setModalErrorMessage("There was an error editing the rider");
            return false;
        }

        if(competitorResponse.status != 200){
            setModalErrorMessage("Make sure the information is valid");
            return false;
        }

        setSuccessMessage("Changes saved");
        retrieveSeason();
        return true;
    }

    async function deleteSeasonCompetitor(competitorId, seasonId){
        resetApplicationMessages();
        const competitorResponse = await submitDeleteCompetitor(competitorId, seasonId);

        if(competitorResponse.error || competitorResponse.status != 200){
            setModalErrorMessage("There was an error deleting the rider");
            console.log(competitorResponse.error);
            return false;
        }

        setSuccessMessage("Rider deleted");
        retrieveSeason();
        return true;
    }

    return(
        <SeasonContext.Provider value={{ season, seasonLoading, retrieveSeason,
                                        createSeasonRace, addSeasonRaceResults, editSeasonRace, deleteSeasonRace,
                                        createSeasonCompetitor, editSeasonCompetitor, deleteSeasonCompetitor, }}>
            <Outlet/>
        </SeasonContext.Provider>
    );
}

export function useSeasonContext(){
    return useContext(SeasonContext);
}