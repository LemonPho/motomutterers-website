import React, { createContext, useContext, useEffect, useState } from "react";
import { useApplicationContext } from "../ApplicationContext";
import { getRace, getRaceWeekend, getRaceWeekends, getSeasonsSimple } from "../fetch-utils/fetchGet";
import { Outlet, replace, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

const RaceWeekendsContext = createContext();

export default function RaceWeekendsContextProvider({ children }){
    const { setErrorMessage, currentSeason, currentSeasonLoading } = useApplicationContext();

    const [raceWeekends, setRaceWeekends] = useState([]);
    const [raceWeekendsLoading, setRaceWeekendsLoading] = useState();
    const [selectedRaceWeekend, setSelectedRaceWeekend] = useState(false);
    const [selectedRaceWeekendLoading, setSelectedRaceWeekendLoading] = useState();

    const [seasonList, setSeasonList] = useState([]);
    const [seasonListLoading, setSeasonListLoading] = useState();
    const [selectedSeason, setSelectedSeason] = useState(null);

    const navigate = useNavigate();
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

        if(raceWeekendsResponse.status === 404){
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
            await retrieveRaceWeekends();
            await retrieveSeasonList();
        }

        fetchData();
    }, [selectedSeason]);

    useEffect(() => {
        const season = searchParams.get("season");
        if(season !== null && season !== selectedSeason){
            setSelectedSeason(season);
        }
    }, [location.search]);

    useEffect(() => {
        if(selectedSeason !== null){
            return;
        }

        const season = searchParams.get("season");
        if(season === null && !currentSeasonLoading){
            setSelectedSeason(currentSeason.year);
            navigate(`/race-weekends?season=${currentSeason.year}`, {replace: true});
        } else if(season !== null){
            setSelectedSeason(season);
        }
    }, [currentSeasonLoading]);

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