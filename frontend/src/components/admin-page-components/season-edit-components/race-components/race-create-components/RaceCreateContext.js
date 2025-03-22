import React, { createContext, useContext, useState, useEffect } from "react";
import { submitFullRace } from "../../../../fetch-utils/fetchPost";
import { useApplicationContext } from "../../../../ApplicationContext";
import { useSeasonContext } from "../../SeasonContext";
import { useOpenersContext } from "../../../../OpenersContext";

const RaceCreateContext = createContext();

export default function RaceCreateContextProvider({children}){
    //manual creation
    const [track, setTrack] = useState("");
    const [title, setTitle] = useState("");
    const [timestamp, setTimestamp] = useState("");
    const [isSprint, setIsSprint] = useState(false);

    //automatic creation
    const [link, setLink] = useState("");
    const [raceDate, setRaceDate] = useState("");
    const [raceType, setRaceType] = useState(1);

    const [selectedCompetitors, setSelectedCompetitors] = useState([]);
    const [competitorsPositions, setCompetitorsPositions] = useState([]);

    //create race responses
    const [invalidCompetitors, setInvalidCompetitors] = useState([]);

    const { closeModal } = useOpenersContext();
    const { setErrorMessage, setSuccessMessage, setLoadingMessage } = useApplicationContext();
    const { season, retrieveSeason } = useSeasonContext();

    function resetVariables(){
        setTrack("");
        setTitle("");
        setTimestamp("");
        setIsSprint(false);
        setSelectedCompetitors([]);
        setCompetitorsPositions([]);
        setInvalidCompetitors([]);
        setLink("");
        setRaceDate("");
        setRaceType(1);
    }

    async function createRace(){
        setLoadingMessage("Loading...");
        setInvalidCompetitors([]);

        let newRace = {
            race: {
                title: title,
                track: track,
                timestamp: timestamp,
                is_sprint: isSprint,
                finalized: true,
            },
            competitors_positions: competitorsPositions,
        };

        let raceResponse = await submitFullRace(newRace, season.year);

        if(raceResponse.error){
            setErrorMessage("There was an error submiting the race");
            return;
        }

        if(raceResponse.competitorsNotFound.includes(true)){
            setErrorMessage("Highlighted competitors were not found in the database");
            setInvalidCompetitors(raceResponse.competitorsNotFound);
            return;
        }

        if(raceResponse.invalidCompetitorsPositionsSpacing.length != 0){
            setErrorMessage("Highlighted competitors have invalid spacing (positions) between them");
            setInvalidCompetitors(raceResponse.invalidCompetitorsPositionsSpacing);
            return;
        }

        if(raceResponse.invalidCompetitorsPositions){
            setErrorMessage("Some or all competitor positions could not be created");
            return;
        }

        if(raceResponse.invalidSeason){
            setErrorMessage("There was an error retrieving the season from the database or it doesn't exist");
            return;
        }

        if(raceResponse.invalidRaceData){
            setErrorMessage("Some or all of the details of the race are bad (title, track, date, etc)")
            return;
        }

        if(raceResponse.status === 400){
            setErrorMessage("There was an error submiting the race");
            return;
        }

        resetVariables();
        setLoadingMessage(false);
        setSuccessMessage("Race successfully added");
        closeModal();
        retrieveSeason();
        return;
    }

    return (
        <RaceCreateContext.Provider value = {{  
            track, title, timestamp, isSprint, setTrack, setTitle, setIsSprint, setTimestamp, setSelectedCompetitors, setCompetitorsPositions, competitorsPositions, selectedCompetitors,
            link, setLink, raceDate, setRaceDate, raceType, setRaceType,
            createRace, invalidCompetitors, resetVariables }}>

            {children}
        </RaceCreateContext.Provider>
    )
}

export function useRaceCreateContext(){
    return useContext(RaceCreateContext);
}