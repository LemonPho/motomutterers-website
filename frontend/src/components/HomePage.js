import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { getRaceResults, getCurrentUser, getCurrentSeason } from "./fetch-utils/fetchGet";

import ApplicationContext, { useApplicationContext } from "./ApplicationContext";
import { useSeasonContext } from "./admin-page-components/season-edit-components/SeasonContext";


export default function HomePage(){
    const { user, loggedIn, retrieveUserData, setLogout, setErrorMessage, currentSeason, selectPicksState, contextLoading } = useApplicationContext();

    if(contextLoading){
        return;
    }

    return (
        <div style={{ width: "100%" }}>
            <div className="row my-2">
                {
                currentSeason.year && 
                    <a className="col card rounded-15 clickable link-no-decorations me-1" href={`/raceresults?season=${currentSeason.year}`}>
                        <div className="card-body">
                            <h1>Race Results</h1>
                        </div>
                    </a>
                }
                
                <a className="col card rounded-15 clickable link-no-decorations ms-1" href="/announcements?page=1">
                    <div className="card-body">
                        <h1>Announcements</h1>
                    </div>
                </a>
            </div>
            <div className="row my-2">
                {
                currentSeason.year && 
                    <a className="col card rounded-15 clickable link-no-decorations" href={`/standings?season=${currentSeason.year}`}>
                        <div className="card-body">
                            <h1>Standings</h1>
                        </div>
                    </a>
                }
                    
            </div>
            {loggedIn && selectPicksState && 
            <div className="row my-2">
                <a className="col card rounded-15 clickable link-no-decorations" href="/select-picks">
                    <div className="card-body">
                        <h1>Select your picks!</h1>
                    </div>
                </a>
            </div>
            }
        </div>
    );
}

