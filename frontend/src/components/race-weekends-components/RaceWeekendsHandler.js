import React from "react";
import { useRaceWeekendContext } from "./RaceWeekendsContext";
import RaceWeekend from "./RaceWeekend";
import RaceWeekends from "./RaceWeekends";
import PageNotFound from "../PageNotFound";

export default function RaceWeekendsHandler(){
    const { selectedRaceWeekend, selectedSeason, seasonListLoading, selectedRaceWeekendLoading } = useRaceWeekendContext();

    if(selectedRaceWeekendLoading){
        return(
            <div>
                <div className="card element-background-color element-border-color mb-2 rounded-15">
                    <div className="card rounded-15 nested-element-color mb-2" id="race-result-card">
                        <div className="card-header loading-placeholder">
                            <h5 className="fade-in-out"></h5>
                        </div>
                    </div>
        
                    <div className="card rounded-15 nested-element-color mb-2" id="standings-card">
                        <div className="card-header loading-placeholder">
                            <h5 className="fade-in-out"></h5>
                        </div>
                    </div>

                    <div className="card rounded-15 nested-element-color mb-2" id="standings-card">
                        <div className="card-header loading-placeholder">
                            <h5 className="fade-in-out"></h5>
                        </div>
                    </div>
                </div>
            </div>  
        );
    }

    if(seasonListLoading){
        return(
            <div>
                <div className="card element-background-color element-border-color mb-2 rounded-15">
                    <div className="card rounded-15 nested-element-color mb-2" id="race-result-card">
                        <div className="card-header loading-placeholder">
                            <h5 className="fade-in-out"></h5>
                        </div>
                    </div>
        
                    <div className="card rounded-15 nested-element-color mb-2" id="standings-card">
                        <div className="card-header loading-placeholder">
                            <h5 className="fade-in-out"></h5>
                        </div>
                    </div>

                    <div className="card rounded-15 nested-element-color mb-2" id="standings-card">
                        <div className="card-header loading-placeholder">
                            <h5 className="fade-in-out"></h5>
                        </div>
                    </div>
                </div>
            </div>  
        );
    }

    if(selectedRaceWeekend){
        return < RaceWeekend />
    }

    if(selectedSeason){
        return < RaceWeekends/>
    }


    return <PageNotFound />
}