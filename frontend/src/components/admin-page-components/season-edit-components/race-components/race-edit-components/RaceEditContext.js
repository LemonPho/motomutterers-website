import React, { createContext, useContext, useState, useEffect } from "react";
import { getRace } from "../../../../fetch-utils/fetchGet";
import { useApplicationContext } from "../../../../ApplicationContext";
import { submitEditRace } from "../../../../fetch-utils/fetchPost";
import { useSeasonContext } from "../../SeasonContext";
import { closeModals } from "../../../../utils";

const RaceEditContext = createContext();

export default function RaceEditContextProvider({children, raceId}){
    const { setModalErrorMessage, setSuccessMessage, resetApplicationMessages } = useApplicationContext();
    const { retrieveSeason } = useSeasonContext();

    const [track, setTrack] = useState("");
    const [title, setTitle] = useState("");
    const [timestamp, setTimestamp] = useState("");
    const [isSprint, setIsSprint] = useState(false);
    const [raceEditLoading, setRaceEditLoading] = useState(true);

    function resetVariables(){
        setTrack("");
        setTitle("");
        setTimestamp("");
        setIsSprint(false);
    }

    async function retrieveRaceDetails(){
        resetApplicationMessages();
        //when there isn't a race selected to edit in the beginning raceId is null
        if(raceId == null){
            return;
        }

        const raceResponse = await getRace(raceId);

        if(raceResponse.status != 200 && raceResponse.status != 201){
            setModalErrorMessage("There was an error retrieving the race data");
            return;
        }

        setTrack(raceResponse.race.track);
        setTitle(raceResponse.race.title);
        setTimestamp(raceResponse.race.timestamp);
        setIsSprint(raceResponse.race.is_sprint);
    }

    async function editRace(){
        resetApplicationMessages();

        const newRace = {
            title: title,
            track: track,
            timestamp: timestamp,
            isSprint: isSprint,
            id: raceId,
        }

        const raceResponse = await submitEditRace(newRace);

        if(raceResponse.error || raceResponse.status != 201){
            setModalErrorMessage("There has been an error editing the race, make sure the data inputted is correct")
            return;
        }

        setSuccessMessage("Race edited");
        retrieveSeason();
        closeModals();
        resetVariables();
    }

    useEffect(() => {
        async function retrieve(){
            setRaceEditLoading(true);
            await retrieveRaceDetails();
            setRaceEditLoading(false);
        }

        retrieve();
        
    }, [raceId])

    return (
        <RaceEditContext.Provider value={{track, title, timestamp, isSprint, setTrack, setTitle, setTimestamp, setIsSprint, editRace, raceEditLoading}}>
            {children}
        </RaceEditContext.Provider>
    )
}

export function useRaceEditContext(){
    return useContext(RaceEditContext);
}