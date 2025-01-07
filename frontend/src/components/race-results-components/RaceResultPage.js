import React, { useEffect } from "react";
import { useRaceResultsContext } from "./RaceResultsContext";

export default function RaceResultPage({ raceId }){

    const { raceResultDetails, raceResultDetailsLoading, retrieveRaceResultDetails } = useRaceResultsContext();

    useEffect(() => {
        async function fetchData(){
            await retrieveRaceResultDetails(raceId);
        }

        fetchData();
    }, [raceId])

    if(raceResultDetailsLoading || !raceResultDetails){
        return(
            <div>
                <div className="card element-background-color element-border-color" id="race-result-card">
                    <div className="card-header rounded-15-top">
                        <h5 className="fade-in-out"></h5>
                    </div>
                    <div className="card-body">
                        <ul>
                            <li className="fade-in-out"></li>
                            <li className="fade-in-out"></li>
                            <li className="fade-in-out"></li>
                            <li className="fade-in-out"></li>
                            <li className="fade-in-out"></li>
                            <li className="fade-in-out"></li>
                        </ul>
                    </div>
                </div>

                <div className="card element-background-color element-border-color" id="standings-card">
                    <div className="card-header rounded-15-top">
                        <h5 className="fade-in-out"></h5>
                    </div>
                    <div className="card-body">
                        <ul>
                            <li className="fade-in-out"></li>
                            <li className="fade-in-out"></li>
                            <li className="fade-in-out"></li>
                            <li className="fade-in-out"></li>
                            <li className="fade-in-out"></li>
                            <li className="fade-in-out"></li>
                        </ul>
                    </div>
                </div>
            </div>
            
        );
    }

    return(
        <div>
            <div className="card rounded-15 element-background-color element-border-color" id="race-result-card">
                <div className="card-header rounded-15-top">
                    <div className="d-flex align-items-center">
                        <h5 className="p-2">
                            {raceResultDetails.title}
                            {raceResultDetails.is_sprint && " (Sprint)"}
                        </h5>
                        <div className="ms-auto">
                            <div className="container">
                                {raceResultDetails.finalized && <span className="badge rounded-pill text-bg-success">Final</span>}
                                {!raceResultDetails.finalized && <span className="badge rounded-pill text-bg-secondary">Upcoming</span>}
                            </div>
                        </div>
                    </div>
                    </div>
                <div className="card-body">
                    <div className="row g-0" style={{marginRight: "0"}}>
                        <strong className="col-2">Pos</strong>
                        <strong className="col-2">#</strong>
                        <strong className="col-6">Name</strong>
                        <strong className="col-2">Points</strong>
                    </div>

                    {raceResultDetails.finalized && raceResultDetails.competitors_positions.map((competitor_position) => (
                        <div className="row g-0" key={`competitor-${competitor_position.competitor_id}`} style={{marginRight: "0px"}}>                                       
                            {competitor_position.position == 0 && <span className="col-2">-</span>}
                            {competitor_position.position != 0 && <span className="col-2">{competitor_position.position}</span>}                     
                            <span className="col-2">#{competitor_position.number}</span>
                            <span className="col-6">{competitor_position.first} {competitor_position.last}</span>
                            <span className="col-2">{competitor_position.points}</span>
                        </div>
                    ))}

                    {!raceResultDetails.finalized && raceResultDetails.qualifying_positions.map((qualifying_position) => (
                        <div className="row g-0" key={`competitor-${qualifying_position.competitor_id}`} style={{marginRight: "0px"}}>                                       
                            {qualifying_position.position == 0 && <span className="col-2">-</span>}
                            {qualifying_position.position != 0 && <span className="col-2">{qualifying_position.position}</span>}                     
                            <span className="col-2">#{qualifying_position.number}</span>
                            <span className="col-6">{qualifying_position.first} {qualifying_position.last}</span>
                            <span className="col-2">-</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        
    );
}