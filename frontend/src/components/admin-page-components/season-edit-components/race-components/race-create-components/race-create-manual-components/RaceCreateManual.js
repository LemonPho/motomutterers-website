import React, { useState, useEffect } from "react";

import { useApplicationContext } from "../../../../../ApplicationContext";
import { useSeasonContext } from "../../../SeasonContext";
import { toggleModal } from "../../../../../utils";
import RaceDetailsCreateModal from "./RaceDetailsCreateModal";
import RaceResultsCreateModal from "./RaceResultsCreateModal";
import RaceSelectCompetitorsCreateModal from "./RaceSelectCompetitorsCreateModal";

export default function RaceCreateManual(){

    const { modalErrorMessage, contextLoading, loggedIn, user } = useApplicationContext();
    const { season, seasonLoading } = useSeasonContext();


    if(seasonLoading || contextLoading){
        return;
    }

    return (
        <div>

            <RaceDetailsCreateModal/>

            <RaceResultsCreateModal/>

            <RaceSelectCompetitorsCreateModal/>

            <RaceResultsCreateModal/>
            
        </div>
        
    )
}