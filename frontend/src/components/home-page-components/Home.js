import React from "react";

import Announcement from "./HomePageAnnouncement";
import { useApplicationContext } from "../ApplicationContext";
import RaceWeekend from "./HomePageRaceWeekend";
import Standings from "./HomePageStandings";
import Welcome from "./Welcome";

export default function Home(){
    const { currentSeason, contextLoading, user } = useApplicationContext();

    if(contextLoading){
        return(
            <div className="row d-flex align-items-stretch">
                <div className="col">
                    <RaceWeekend />
                </div>
            
                <div className="col">
                    <Announcement />
                </div>
            </div>
        );
    } else if(!user.is_logged_in) {
        return(
            <Welcome />
        )
    } else {
        return(
            <>
                <div className="row d-flex align-items-stretch mb-2 g-2">

                    {currentSeason.year && 
                    <div className="col">
                        <RaceWeekend />
                    </div>}

                    <div className="col">
                        <Announcement />
                    </div>
                </div>

                {currentSeason.year && 
                <div className="row g-0">
                    <Standings />
                </div>}
            </>
        )
    }
}