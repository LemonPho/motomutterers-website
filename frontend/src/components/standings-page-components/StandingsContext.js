import React, { useContext, createContext, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getSeasonSimple, getSeasonsSimpleYear, getUserPicks, getSeasonStandings, getUserPicksSimple } from "../fetch-utils/fetchGet";
import { useApplicationContext } from "../ApplicationContext";

const StandingsContext = createContext();

export default function StandingsContextProvider(){
    const { setErrorMessage, setSuccessMessage } = useApplicationContext();

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

    function copyStandingsTable(){ 
        if(!standings || standings.users_picks.length == 0){
            setErrorMessage("There are no standings to be copied");
            return;
        }
        
        let result = "<table>\n";

        for(let i=0; i < standings.users_picks.length; i++){
            result += "\t<tr>\n";
            result += "\t\t<td>";
            result += "<b>";
            result += String(i+1) + ". ";
            result += standings.users_picks[i].user.username + " - ";
            result += standings.users_picks[i].points;
            result += "</b>";
            result += "</td>\n";
            for(let j=0; j < standings.users_picks[i].picks.length; j++){
                result += "\t\t<td>";
                result += standings.users_picks[i].picks[j].first[0] + ". " + standings.users_picks[i].picks[j].last.slice(0, 3);
                result += " - " + standings.users_picks[i].picks[j].points;
                result += "</td>\n";
            }
            if(standings.users_picks[i].independent_pick){
                result += "\t\t<td>";
                result += standings.users_picks[i].independent_pick.first[0] + ". " + standings.users_picks[i].independent_pick.last.slice(0, 3);
                result += " - " + standings.users_picks[i].independent_pick.points;
                result += "</td>\n";
            }
            if(standings.users_picks[i].rookie_pick){
                result += "\t\t<td>";
                result += standings.users_picks[i].rookie_pick.first[0] + ". " + standings.users_picks[i].rookie_pick.last.slice(0, 3);
                result += " - " + standings.users_picks[i].rookie_pick.points;
                result += "</td>\n";
            }
            result += "\t</tr>\n";
        }
        result += "</table>";

        navigator.clipboard.writeText(result);
        setSuccessMessage("Table copied to clipboard");
    }
    
    return(
        <StandingsContext.Provider value={{
            retrieveStandings, retrieveSelectedSeason, retrieveSeasonList, retrieveUserPicks,
            standings, userPicksDetailed, seasonList, selectedSeason,
            standingsLoading, userPicksDetailedLoading, seasonListLoading, selectedSeasonLoading,
            copyStandingsTable,
        }}>
            <Outlet />
        </StandingsContext.Provider>
    );
}

export function useStandingsContext(){
    return useContext(StandingsContext);
}