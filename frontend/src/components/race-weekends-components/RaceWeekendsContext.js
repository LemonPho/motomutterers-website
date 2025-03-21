import React, { createContext, useContext, useEffect, useState } from "react";
import { useApplicationContext } from "../ApplicationContext";
import { getRace, getRaceWeekend, getRaceWeekends, getSeasonsSimple } from "../fetch-utils/fetchGet";
import { Outlet, useLocation, useParams, useSearchParams } from "react-router-dom";

const RaceWeekendsContext = createContext();

export default function RaceWeekendsContextProvider({ children }){
    const { setErrorMessage } = useApplicationContext();

    const [raceWeekends, setRaceWeekends] = useState([]);
    const [raceWeekendsLoading, setRaceWeekendsLoading] = useState();
    const [selectedRaceWeekend, setSelectedRaceWeekend] = useState(false);
    const [selectedRaceWeekendLoading, setSelectedRaceWeekendLoading] = useState();

    const [seasonList, setSeasonList] = useState([]);
    const [seasonListLoading, setSeasonListLoading] = useState();
    const [selectedSeason, setSelectedSeason] = useState();

    const location = useLocation();
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

        if(raceWeekendsResponse.invalidSeason){
            setErrorMessage("Season not found");
            return;
        }

        if(raceWeekendsResponse.status != 200){
            setErrorMessage("There was an error retrieving the race weekends");
            return;
        }

        setRaceWeekends(raceWeekendsResponse.raceWeekends);
    }

    async function retrieveSeasonList(){
        if(searchParams.get("season") == null){
            setSelectedSeason(null);
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
            await retrieveRaceWeekends();
        }

        fetchData();
    }, [selectedSeason]);

    useEffect(() => {
        async function fetchData(){
            await retrieveSeasonList();
            await retrieveRaceWeekend();
        }

        fetchData();
    }, [location])

    return(
        <RaceWeekendsContext.Provider value={{
            raceWeekends, raceWeekendsLoading, selectedRaceWeekend, selectedRaceWeekendLoading,
            seasonList, seasonListLoading, selectedSeason,
        }}>
            
            <Outlet />
        </RaceWeekendsContext.Provider>
    )

}

export function useRaceWeekendContext(){
    return useContext(RaceWeekendsContext);
}