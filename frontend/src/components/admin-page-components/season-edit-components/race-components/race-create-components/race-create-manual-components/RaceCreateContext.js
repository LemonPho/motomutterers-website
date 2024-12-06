import React, { createContext, useContext, useState, useEffect } from "react";
import { submitFullRace } from "../../../../../fetch-utils/fetchPost";
import { useApplicationContext } from "../../../../../ApplicationContext";
import { closeModals } from "../../../../../utils";
import { useSeasonContext } from "../../../SeasonContext";

const RaceCreateContext = createContext();

export default function RaceCreateContextProvider({children}){
    const [track, setTrack] = useState("");
    const [title, setTitle] = useState("");
    const [timestamp, setTimestamp] = useState("");
    const [isSprint, setIsSprint] = useState(false);

    const [selectedCompetitors, setSelectedCompetitors] = useState([]);
    const [competitorsPositions, setCompetitorsPositions] = useState([]);

    //create race responses
    const [invalidCompetitors, setInvalidCompetitors] = useState([]);

    const { setModalErrorMessage, setSuccessMessage } = useApplicationContext();
    const { season, retrieveSeason } = useSeasonContext();

    function resetVariables(){
        setTrack("");
        setTitle("");
        setTimestamp("");
        setIsSprint("");
        setSelectedCompetitors([]);
        setCompetitorsPositions([]);
        setInvalidCompetitors([]);
    }

    async function createRace(){
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
            console.log(raceResponse);
            setModalErrorMessage("There was an error submiting the race");
            return;
        }

        if(raceResponse.competitorsNotFound.includes(true)){
            setModalErrorMessage("Highlighted competitors were not found in the database");
            setInvalidCompetitors(raceResponse.competitorsNotFound);
            return;
        }

        if(raceResponse.invalidCompetitorsPositionsSpacing.length != 0){
            setModalErrorMessage("Highlighted competitors have invalid spacing (positions) between them");
            setInvalidCompetitors(raceResponse.invalidCompetitorsPositionsSpacing);
            return;
        }

        if(raceResponse.invalidCompetitorsPositions){
            setModalErrorMessage("Some or all competitor positions could not be created");
            return;
        }

        if(raceResponse.invalidSeason){
            setModalErrorMessage("There was an error retrieving the season from the database or it doesn't exist");
            return;
        }

        if(raceResponse.invalidRaceData){
            setModalErrorMessage("Some or all of the details of the race are bad (title, track, date, etc)")
            return;
        }

        if(raceResponse.status === 400){
            setModalErrorMessage("There was an error submiting the race");
            return;
        }

        resetVariables();
        setSuccessMessage("Race successfully added");
        closeModals();
        retrieveSeason();
        return;
    }

    return (
        <RaceCreateContext.Provider value = {{  track, title, timestamp, isSprint, setTrack, setTitle, setIsSprint, setTimestamp, setSelectedCompetitors, setCompetitorsPositions, competitorsPositions, selectedCompetitors,
                                                createRace, invalidCompetitors }}>

            {children}
        </RaceCreateContext.Provider>
    )
}

export function useRaceCreateContext(){
    return useContext(RaceCreateContext);
}