import React from "react";
import { useRaceWeekendContext } from "./RaceWeekendsContext";
import RaceWeekend from "./RaceWeekend";
import RaceWeekends from "./RaceWeekends";
import PageNotFound from "../PageNotFound";

export default function RaceWeekendsHandler(){
    const { selectedRaceWeekend, selectedSeason } = useRaceWeekendContext();

    if(selectedRaceWeekend){
        return < RaceWeekend />
    }

    if(selectedSeason){
        return < RaceWeekends/>
    }

    return <PageNotFound />
}