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
import SeasonMessages from "./SeasonMessages";

export default function SeasonEdit(){
    const { retrieveSeason, season, seasonLoading } = useSeasonContext();
    const { contextLoading, user, userLoading } = useApplicationContext();

    useEffect(() => {
        retrieveSeason();
    }, [userLoading])

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
                        <SeleniumStatus />
                    </div>
                    }
                    {season.season_messages.length > 0 &&
                    <div className="row">
                        <SeasonMessages />
                    </div>
                    }
                    <div className="row">
                        <CompetitorsManagement/>
                        <RacesManagement/>
                    </div>
                    <div className="row">
                        <div className="card rounded-15 col-md element-background-color element-border-color" style={{padding: "10px"}}>
                            <div className="rounded-15 nested-element-color p-2">
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
            </div>
        );
    }
}