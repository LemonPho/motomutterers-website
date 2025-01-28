import React, { useContext, createContext, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getSeasonSimple, getSeasonsSimpleYear, getUserPicks, getSeasonStandings, getUserPicksSimple } from "../fetch-utils/fetchGet";
import { useApplicationContext } from "../ApplicationContext";

const StandingsContext = createContext();

export default function StandingsContextProvider(){
    const { setErrorMessage } = useApplicationContext();

    const [standings, setStandings] = useState({});
    const [standingsLoading, setStandingsLoading] = useState(true);
    const [userPicksDetailed, setUserPicksDetailed] = useState({});
    const [userPicksDetailedLoading, setUserPicksDetailedLoading] = useState(true);

    const [seasonList, setSeasonList] = useState([]);
    const [seasonListLoading, setSeasonListLoading] = useState(true);
    const [selectedSeason, setSelectedSeason] = useState({});
    const [selectedSeasonLoading, setSelectedSeasonLoading] = useState(true);

    async function retrieveStandings(){
        setStandingsLoading(true);
        const params = new URLSearchParams(location.search);
        const seasonYear = params.get("season");

        const usersStandingsResponse = await getSeasonStandings(seasonYear);

        if(usersStandingsResponse.error){
            console.log(usersStandingsResponse.error);
            setErrorMessage("There was an error retrieving the standings");
            return;
        }

        if(usersStandingsResponse.status === 200){
            setStandings(usersStandingsResponse.standings);
            setStandingsLoading(false);
        }
    }

    async function retrieveSelectedSeason(){
        setSelectedSeasonLoading(true);
        const params = new URLSearchParams(location.search);
        const seasonYear = params.get("season");

        const seasonResponse = await getSeasonSimple(seasonYear);

        if(seasonResponse.error){
            setErrorMessage("There was an error retrieving season data");
            return;
        }

        if(seasonResponse.status != 200){
            setErrorMessage("Be sure to select a valid season");
            return;
        }

        setSelectedSeason(seasonResponse.season);
        setSelectedSeasonLoading(false);
    }

    async function retrieveSeasonList(){
        setSeasonListLoading(true);
        const seasonListResponse = await getSeasonsSimpleYear();

        if(seasonListResponse.error || seasonListResponse.status != 200){
            setErrorMessage("There was an error retrieving the season list");
            return;
        }

        setSeasonList(seasonListResponse.seasons);
        setSeasonListLoading(false);
    }

    async function retrieveUserPicks(userId){
        setUserPicksDetailedLoading(true);
        const userPicksResponse = await getUserPicksSimple(selectedSeason.id, userId);

        if(userPicksResponse.error){
            setErrorMessage("There was an error retrieving the user picks");
            return;
        }

        if(userPicksResponse.status == 404){
            setErrorMessage("The user picks was not found");
            return;
        }

        if(userPicksResponse.status != 200){
            setErrorMessage("There was an error loading the user picks");
            return;
        }

        setUserPicksDetailed(userPicksResponse.userPicks);
        setUserPicksDetailedLoading(false);
    }
    
    return(
        <StandingsContext.Provider value={{
            retrieveStandings, retrieveSelectedSeason, retrieveSeasonList, retrieveUserPicks,
            standings, userPicksDetailed, seasonList, selectedSeason,
            standingsLoading, userPicksDetailedLoading, seasonListLoading, selectedSeasonLoading,
        }}>
            <Outlet />
        </StandingsContext.Provider>
    );
}

export function useStandingsContext(){
    return useContext(StandingsContext);
}