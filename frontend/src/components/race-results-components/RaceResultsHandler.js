import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import RaceResultPage from "./RaceResultPage";
import RaceResultsPage from "./RaceResultsPage";
import PageNotFound from "../PageNotFound";
import { useRaceResultsContext } from "./RaceResultsContext";

export default function RaceResultsHandler(){
    const { raceId } = useParams();
    const [ searchParams ] = useSearchParams();

    const { retrieveSeasonList, seasonList, seasonListLoading, setSelectedSeason, selectedSeason } = useRaceResultsContext();

    const seasonYear = searchParams.get("season");   

    if(raceId){
        return <RaceResultPage raceId={raceId}/>
    } else if(seasonYear){
        useEffect(() => {
            async function fetchData(){
                await retrieveSeasonList();
            }
    
            fetchData();
        }, []);
    
        useEffect(() => {
            if(seasonListLoading || seasonList == undefined){
                return;
            }
    
            for(let i=0; i < seasonList.length; i++){
                if(seasonList[i].year == seasonYear){
                    setSelectedSeason(seasonList[i]);
                }
            }
        }, [seasonList]);
    
        if(!selectedSeason){
            return <PageNotFound/>
        }
        return <RaceResultsPage seasonYear={seasonYear}/>
    } else {
        return <PageNotFound/>
    }

}