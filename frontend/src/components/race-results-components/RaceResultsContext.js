import React, { useContext, createContext, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";

import { getRace, getRaceResults, getSeasonsSimple } from "../fetch-utils/fetchGet";
import { useApplicationContext } from "../ApplicationContext";

const RaceResultsContext = createContext();

export default function RaceResultsContextProvider(){
    const { setErrorMessage, setSuccessMessage } = useApplicationContext();

    const [raceResults, setRaceResults] = useState();
    const [raceResultsLoading, setRaceResultsLoading] = useState();
    const [raceResultDetails, setRaceResultDetails] = useState(false);
    const [raceResultDetailsLoading, setRaceResultDetailsLoading] = useState();
    const [seasonList, setSeasonList] = useState();
    const [seasonListLoading, setSeasonListLoading] = useState();
    const [selectedSeason, setSelectedSeason] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [searchParams] = useSearchParams();

    async function retrieveRaceResults(){
        setRaceResultsLoading(true);
        const seasonYear = searchParams.get("season");
        if(seasonYear == null){
            return;
        }

        const raceResultsResponse = await getRaceResults(seasonYear);

        console.log(raceResultsResponse);

        if(raceResultsResponse.error){
            setErrorMessage("There was an error loading the race results");
            return;
        }

        if(raceResultsResponse.status === 404){
            setErrorMessage("Be sure to select a valid season");
            return;
        }

        if(raceResultsResponse.status != 200){
            setErrorMessage("Be sure your request is valid");
            return;
        }

        setRaceResults(raceResultsResponse.raceResults);
        setRaceResultsLoading(false);
    }

    async function retrieveRaceResultDetails(id){
        setRaceResultDetailsLoading(true);
        const raceResultDetailsResponse = await getRace(id);

        if(raceResultDetailsResponse.error){
            setErrorMessage("There was an error loading the race result");
            return;
        }

        if(raceResultDetailsResponse.status === 404){
            setErrorMessage("Race result was not found");
            return;
        }

        if(raceResultDetailsResponse.status != 200){
            setErrorMessage("There was an error loading the race result");
            return;
        }

        setRaceResultDetails(raceResultDetailsResponse.race);
        setRaceResultDetailsLoading(false);
    }

    async function retrieveSeasonList(){
        setSeasonListLoading(true);
        const seasonListResponse = await getSeasonsSimple();

        if(seasonListResponse.error || seasonListResponse.status != 200){
            setErrorMessage("There was an error loading the season list");
            return;
        }

        setSeasonList(seasonListResponse.seasons);
        setSeasonListLoading(false);
    }

    return(
        <RaceResultsContext.Provider value={{
            raceResults, raceResultsLoading, raceResultDetails, raceResultDetailsLoading, seasonList, seasonListLoading, selectedSeason, setSelectedSeason,
            retrieveRaceResults, retrieveRaceResultDetails, retrieveSeasonList,
        }}>
            <Outlet/>

        </RaceResultsContext.Provider>
    );
}

export function useRaceResultsContext(){
    return useContext(RaceResultsContext);
}