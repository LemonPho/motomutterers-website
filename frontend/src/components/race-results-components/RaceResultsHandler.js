import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import RaceResultPage from "./RaceResultPage";
import RaceResultsPage from "./RaceResultsPage";
import PageNotFound from "../PageNotFound";
import { useRaceResultsContext } from "./RaceResultsContext";

export default function RaceResultsHandler(){
    const { raceId } = useParams();
    const [ searchParams ] = useSearchParams();

    const { retrieveSeasonList, selectedSeason } = useRaceResultsContext();

    const seasonYear = searchParams.get("season");

    const [loading, setLoading] = useState();

    async function fetchData(){
        if(seasonYear){
            setLoading(true);
            await retrieveSeasonList();  
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();  
    }, [location.search]);

    if(loading){
        return;
    }

    if(raceId){
        return <RaceResultPage raceId={raceId}/>
    } else if(seasonYear){
        if(!selectedSeason){
            return <PageNotFound/>
        }
        return <RaceResultsPage seasonYear={seasonYear}/>
    } else {
        return <PageNotFound/>
    }

}