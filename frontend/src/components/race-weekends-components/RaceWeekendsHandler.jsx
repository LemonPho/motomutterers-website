import React, { useEffect } from "react";
import { useRaceWeekendContext } from "./RaceWeekendsContext";
import RaceWeekend from "./RaceWeekend";
import RaceWeekends from "./RaceWeekends";
import PageNotFound from "../PageNotFound";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useApplicationContext } from "../ApplicationContext";

export default function RaceWeekendsHandler(){
    const { currentSeason, currentSeasonLoading } = useApplicationContext();
    const { setSelectedRaceWeekend, selectedRaceWeekend, setSelectedSeason, selectedSeason, seasonListLoading, selectedRaceWeekendLoading } = useRaceWeekendContext();

    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { raceWeekendId } = useParams();

    useEffect(() => {
        const season = searchParams.get("season");

        if(raceWeekendId === undefined){
            setSelectedRaceWeekend(null);
        }

        if(raceWeekendId !== undefined){
            setSelectedSeason(null);
        }

        if(season !== null && season !== selectedSeason){
            setSelectedSeason(season);
        }

        if(season === null && raceWeekendId === undefined && !currentSeasonLoading){
            setSelectedSeason(currentSeason.year);
            navigate(`race-weekends?season=${currentSeason.year}`, {replace: true});
        }
    }, [location.pathname, location.search, currentSeasonLoading]);

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