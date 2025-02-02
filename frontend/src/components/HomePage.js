import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getRaceResults, getCurrentUser, getCurrentSeason } from "./fetch-utils/fetchGet";

import ApplicationContext, { useApplicationContext } from "./ApplicationContext";
import { useSeasonContext } from "./admin-page-components/season-edit-components/SeasonContext";


export default function HomePage(){
    const { user, retrieveUserData, setLogout, setErrorMessage, currentSeason, selectPicksState, contextLoading } = useApplicationContext();

    if(contextLoading){
        return;
    }

    return (
        <div style={{ width: "100%" }}>
            <div className="row">
                {
                currentSeason.year && 
                    <Link className="col card rounded-15 clickable link-no-decorations me-1 element-background-color element-border-color" to={`/raceresults?season=${currentSeason.year}`}>
                        <div className="card-body">
                            <h1>Race Results</h1>
                        </div>
                    </Link>
                }
                
                <Link className="col card rounded-15 clickable link-no-decorations ms-1 element-background-color element-border-color" to="/announcements?page=1">
                    <div className="card-body">
                        <h1>Announcements</h1>
                    </div>
                </Link>
            </div>
            <div className="row my-2">
                {
                currentSeason.year && 
                    <Link className="col card rounded-15 clickable link-no-decorations element-background-color element-border-color" to={`/standings?season=${currentSeason.year}`}>
                        <div className="card-body">
                            <h1>Standings</h1>
                        </div>
                    </Link>
                }
                    
            </div>
            {user.is_logged_in && selectPicksState && 
            <div className="row my-2">
                <Link className="col card rounded-15 clickable link-no-decorations element-background-color element-border-color" to="/select-picks">
                    <div className="card-body">
                        <h1>Select your picks!</h1>
                    </div>
                </Link>
            </div>
            }
        </div>
    );
}

