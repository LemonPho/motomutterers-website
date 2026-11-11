import React, { createContext, useContext, useEffect, useState } from "react";
import { useApplicationContext } from "../ApplicationContext";
import { getRace, getRaceWeekend, getRaceWeekends, getSeasonsSimple } from "../fetch-utils/fetchGet";
import { Outlet, replace, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

const RaceWeekendsContext = createContext();

export default function RaceWeekendsContextProvider({ children }){
    const { setErrorMessage } = useApplicationContext();

    const [loadedRaceWeekendsSeason, setLoadedRaceWeekendsSeason] = useState(null);
    const [raceWeekends, setRaceWeekends] = useState([]);
    const [raceWeekendsLoading, setRaceWeekendsLoading] = useState();
    const [selectedRaceWeekend, setSelectedRaceWeekend] = useState(null);
    const [selectedRaceWeekendLoading, setSelectedRaceWeekendLoading] = useState();

    const [seasonList, setSeasonList] = useState([]);
    const [seasonListLoading, setSeasonListLoading] = useState();
    const [selectedSeason, setSelectedSeason] = useState(null);

    const [searchParams] = useSearchParams();
    const { raceWeekendId } = useParams();

    async function retrieveRaceWeekends(){
        if(selectedSeason == null){
            return;
        }

        setRaceWeekendsLoading(true);
        const raceWeekendsResponse = await getRaceWeekends(selectedSeason);
        setRaceWeekendsLoading(false);

        if(raceWeekendsResponse.error){
            setErrorMessage("There was an error retrieving the race weekends");
            return;
        }

        if(raceWeekendsResponse.status === 404){
            setErrorMessage("Season not found");
            return;
        }

        if(raceWeekendsResponse.status != 200){
            setErrorMessage("There was an error retrieving the race weekends");
            return;
        }

        setLoadedRaceWeekendsSeason(selectedSeason);
        setRaceWeekends(raceWeekendsResponse.raceWeekends);
    }

    async function retrieveSeasonList(){
        if(selectedSeason == null){
            return;
        }

        setSeasonListLoading(true);
        setSelectedSeason(searchParams.get("season"));

        const seasonListResponse = await getSeasonsSimple();

        if(seasonListResponse.error || seasonListResponse.status != 200){
            setErrorMessage("There was an error loading the season list");
            return;
        }   

        setSeasonList(seasonListResponse.seasons);
        setSeasonListLoading(false);
    }

    async function retrieveRaceWeekend(){
        if(raceWeekendId == undefined){
            setSelectedRaceWeekend(null);
            return;
        }

        setSelectedRaceWeekendLoading(true);
        const raceWeekendResponse = await getRaceWeekend(raceWeekendId);
        setSelectedRaceWeekendLoading(false);

        if(raceWeekendResponse.error){
            setErrorMessage("There was an error getting the race weekend");
            return;
        }

        if(raceWeekendResponse.status == 404){
            setErrorMessage("Race weekend not found");
            return;
        }

        setSelectedRaceWeekend(raceWeekendResponse.raceWeekend);
    }

    useEffect(() => {
        async function fetchData(){
            await retrieveRaceWeekend();
        }
        if(raceWeekendId !== undefined) fetchData();
    }, [raceWeekendId])

    useEffect(() => {
        async function fetchData(){
            await retrieveRaceWeekends();
            await retrieveSeasonList();
        }

        //loadedRaceWeekendsSeason is so that we reuse the already loaded race weekends if the season doesn't change
        if(selectedSeason !== null && loadedRaceWeekendsSeason !== selectedSeason) fetchData();
    }, [selectedSeason])

    return(
        <RaceWeekendsContext.Provider value={{
            raceWeekends, raceWeekendsLoading, selectedRaceWeekend, selectedRaceWeekendLoading,
            seasonList, seasonListLoading, selectedSeason,
            setSelectedRaceWeekend, setSelectedSeason, retrieveRaceWeekend, retrieveRaceWeekends, retrieveSeasonList
        }}>
            
            <Outlet />
        </RaceWeekendsContext.Provider>
    )

}

export function useRaceWeekendContext(){
    return useContext(RaceWeekendsContext);
}