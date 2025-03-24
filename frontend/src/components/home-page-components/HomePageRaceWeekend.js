import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApplicationContext } from "../ApplicationContext";
import { getLatestRaceWeekend, getRaceWeekends } from "../fetch-utils/fetchGet";
import RaceWeekendCard from "../race-weekends-components/RaceWeekendCard";

export default function RaceWeekend({ loading }){
    const { currentSeason, currentSeasonLoading, setErrorMessage } = useApplicationContext();    

    const [raceWeekends, setRaceWeekends] = useState({});
    const [raceWeekendLoading, setRaceWeekendLoading] = useState(true);

    async function retrieveLatestRaceWeekend(){
        if(currentSeasonLoading){
            return;
        }

        setRaceWeekendLoading(true);
        const raceWeekendResponse = await getRaceWeekends(currentSeason.year, 3);
        setRaceWeekendLoading(false);

        if(raceWeekendResponse.error || raceWeekendResponse.status != 200){
            setErrorMessage("There was an error retrieving the latest race weekend");
            return;
        }

        setRaceWeekends(raceWeekendResponse.raceWeekends);
    }

    useEffect(() => {
        async function fetchData(){
            await retrieveLatestRaceWeekend();
        }

        fetchData();
    }, [currentSeasonLoading]);

    if(raceWeekendLoading || currentSeasonLoading || loading){
        return(
            <div className="card rounded-15">
                <div className="card-header loading-placeholder rounded-15-top">
                    <h4 className="fade-in-out"></h4>
                </div>
                <RaceWeekendCard raceWeekend={false} loading={loading || raceWeekendLoading || currentSeasonLoading}/>
            </div>
        );
    } else {
        return(
            <div className="card rounded-15 element-background-color element-border-color">
                <Link className="card-header clickable rounded-15-top nested-element-color link-no-decorations" to={`/race-weekends?season=${currentSeason.year}`}>
                    <h4>Race Weekends</h4>
                </Link>
                <div className="card-body">
                    {raceWeekends.length != 0 && raceWeekends.map((raceWeekend) => (
                        <div className="nested-element-color clickable rounded-15 mb-2" key={raceWeekend.id}>
                            <RaceWeekendCard raceWeekend={raceWeekend} loading={false}/>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}