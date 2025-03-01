import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SeasonContextProvider, { useSeasonContext } from "./SeasonContext";
import PageNotFound from "../../PageNotFound";
import CompetitorsManagement from "./competitor-components/CompetitorsManagement";
import RacesManagement from "./race-components/RacesManagement";
import MemberPicks from "./MemberPicks";
import SeasonFinalize from "./season-finalize-components/SeasonFinalize";
import { useApplicationContext } from "../../ApplicationContext";
import SetCurrentSeason from "./SetCurrentSeason";
import DeleteSeason from "./season-delete-components/DeleteSeason";
import SeleniumStatus from "./SeleniumStatus";

export default function SeasonEdit(){
    const { retrieveSeason, season, seasonLoading } = useSeasonContext();
    const { contextLoading, user } = useApplicationContext();

    useEffect(() => {
        retrieveSeason();
    }, [])

    if(seasonLoading || contextLoading || !season){
        return (
            <div className="container" style={{padding: "0px"}}>
                <div className="row">
                    <div className="card rounded-15 col-md me-2 mt-2 element-background-color element-border-color">
                        Loading...
                    </div>
                    <div className="card rounded-15 col-md mt-2 element-background-color element-border-color">
                        Loading...
                    </div>
                </div>
                <div className="row">
                    <div className="card rounded-15 col-md my-2 element-background-color element-border-color">
                        Loading...
                    </div>
                </div>
            </div>
        );
    }

    if(user.is_admin){
        return (
            <div>
                <div className="container" style={{padding: "0px"}}>
                    {season.selenium_status != null &&
                    <div className="row">
                        <div className="card rounded-15 col-md mb-2 element-background-color element-border-color" style={{padding: "0px"}}>
                            <SeleniumStatus />
                        </div>
                    </div>
                    }
                    <div className="row">
                        <div className="card rounded-15 col-md me-2 mb-2 element-background-color element-border-color" style={{padding: "0px"}}>
                            <CompetitorsManagement/>
                        </div>
                        <div className="card rounded-15 col-md mb-2 element-background-color element-border-color" style={{padding: "0px"}}>
                            <RacesManagement/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="card rounded-15 col-md element-background-color element-border-color" style={{padding: "10px"}}>
                            <MemberPicks />
                            
                            <hr />
                            <SeasonFinalize />

                            <hr />
                            <SetCurrentSeason />

                            <hr />
                            <DeleteSeason />
                        </div> 
                    </div>
                            
                </div>  
            </div>
        );
    }
}