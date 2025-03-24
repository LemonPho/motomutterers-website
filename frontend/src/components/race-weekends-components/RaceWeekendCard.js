import React from "react";
import { Link } from "react-router-dom";

export default function RaceWeekendCard({ raceWeekend, loading }){
    if(loading || !raceWeekend){
        return(
            <div className="d-flex align-items-center">
                <div className="loading-placeholder">
                    <h3 className="fade-in-out"></h3>
                </div>
                <div className="ms-auto loading-placeholder">
                    <span className="badge rounded-pill fade-in-out"></span>
                </div>
            </div>
        );
    } else {
        return(
            <Link className="link-no-decorations mx-auto" to={`/race-weekends/${raceWeekend.id}`}>
                <div className="d-flex align-items-center">
                    <h3 className="p-2">
                        {raceWeekend.title}
                    </h3>
                    <div className="ms-auto">
                        <div className="container">
                        {raceWeekend.status == 0 && <span className="badge rounded-pill text-bg-secondary ms-auto">Upcoming</span>}
                        {raceWeekend.status == 1 && <span className="badge rounded-pill text-bg-warning ms-auto">In progress</span>}
                        {raceWeekend.status == 2 && <span className="badge rounded-pill text-bg-success ms-auto">Final</span>}
                        </div>
                    </div>
                </div>
            </Link>
        );
    }
}