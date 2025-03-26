import React, { useRef, useState } from "react";
import { useRaceWeekendContext } from "./RaceWeekendsContext";
import CommentsSection from "../util-components/comments-section-components/CommentsSection"
import CommentsContextProvider from "../util-components/comments-section-components/CommentsSectionContext";
import { Link } from "react-router-dom";
import Expand from "../util-components/Expand";

export default function RaceWeekend(){
    const { selectedRaceWeekend } = useRaceWeekendContext();

    const [expandRacesDiv, setExpandRacesDiv] = useState(false);

    const [standingsBodyExpanded, setStandingsBodyExpanded] = useState(true);

    if(!selectedRaceWeekend) return null;
    
    return(
        <>
        <div className="card rounded-15 element-background-color element-border-color">
            <div className="card-header rounded-15 nested-element-color m-2">
                <div className="d-flex align-items-center p-1">
                    <h3 style={{margin: "0px"}}>
                        {selectedRaceWeekend.title}
                    </h3>
                    <div className="ms-auto">
                        <div className="container">
                            {selectedRaceWeekend.status == 2 && <span className="badge rounded-pill text-bg-success">Final</span>}
                            {selectedRaceWeekend.status == 1 && <span className="badge rounded-pill text-bg-warning">In progress</span>}
                            {selectedRaceWeekend.status == 0 && <span className="badge rounded-pill text-bg-secondary">Upcoming</span>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-body p-2">
                <div className="row m-0">
                    <div className="col card nested-element-color rounded-15 mb-2 p-0" id="races-card">
                        <div className="card-header rounded-15 clickable nested-element-color mt-2 mx-2" onClick={() => {setExpandRacesDiv(!expandRacesDiv)}}>
                            <h4 style={{margin: "0px"}}>
                                Races
                            </h4>
                        </div>
                        <div className="card-body" style={{paddingBottom: "0px"}}>
                            <Expand expanded={expandRacesDiv} className={"overflow-hidden"} id={"races-card-body"}>
                                <div className="row g-0">
                                    {selectedRaceWeekend.race != null &&
                                    <div className="col-sm card rounded-15 mb-2" id="race-result-card">
                                        <div className="card-header rounded-15-top">
                                            <h5 style={{margin: "0px"}}>
                                                Race
                                            </h5>
                                        </div>
                                        <div className="card-body overflow-auto " style={{"border": "0px", maxHeight: "175px"}}>
                                            <div className="d-flex flex-column justify-content-center">
                                                {selectedRaceWeekend.race.competitors_positions.map((competitorPosition) => (
                                                    <div className="d-flex align-items-center p-2 mb-2 bg-light border rounded shadow-sm" key={`race-position-${competitorPosition.number}`}>
                                                        <div style={{ width: "30px" }} className="text-center">
                                                            {(competitorPosition.position == 0) && <span className="fw-bold">-</span>}
                                                            {(competitorPosition.position != 0) && <span className="fw-bold">{competitorPosition.position}</span>}
                                                        </div>
                                                        <div style={{ width: "50px" }} className="text-muted text-center">
                                                            #{competitorPosition.number}
                                                        </div>
                                                        <div style={{ width: "200px" }} className="fw-semibold">
                                                            {competitorPosition.first} {competitorPosition.last}
                                                        </div>
                                                        <div className="fw-bold text-center ms-auto">
                                                            {competitorPosition.points}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>}
                                    {selectedRaceWeekend.sprint_race != null && 
                                    <div className="col-sm card rounded-15 mb-2" id="sprint-race-result-card">
                                        <div className="card-header rounded-15-top">
                                            <h5 style={{margin: "0px"}}>
                                                Sprint Race
                                            </h5>
                                        </div>
                                            <div className="card-body overflow-auto" style={{"border": "0px", maxHeight: "175px"}}>
                                                {selectedRaceWeekend.sprint_race.competitors_positions.map((competitorPosition) => (
                                                <div className="d-flex align-items-center p-2 mb-2 bg-light border rounded shadow-sm" key={`sprint-position-${competitorPosition.number}`}>
                                                    <div style={{ width: "30px" }} className="text-center">
                                                        {(competitorPosition.position == 0) && <span className="fw-bold">-</span>}
                                                        {(competitorPosition.position != 0) && <span className="fw-bold">{competitorPosition.position}</span>}
                                                    </div>
                                                    <div style={{ width: "50px" }} className="text-muted text-center">
                                                        #{competitorPosition.number}
                                                    </div>
                                                    <div style={{ width: "200px" }} className="fw-semibold">
                                                        {competitorPosition.first} {competitorPosition.last}
                                                    </div>
                                                    <div className="fw-bold text-center ms-auto">
                                                        {competitorPosition.points}
                                                    </div>
                                                </div>))}
                                            </div>
                                        </div>}
                                </div>
                            </Expand>
                        </div>
                    </div>
                </div>
                <div className="row g-0">
                {(selectedRaceWeekend.standings != null) && 
                    <div className="card rounded-15 nested-element-color mb-2" id="standings-card">
                        <div className="card-header rounded-15 clickable nested-element-color mt-2 mx-2" onClick={() => setStandingsBodyExpanded(!standingsBodyExpanded)}>
                            <div className="p-1">
                                <h5 style={{margin: "0px"}}>Standings</h5>
                            </div>
                        </div>
                        <div className="card-body" style={{paddingBottom: "0px"}}>
                            <Expand maxHeight={"40vh"} expanded={standingsBodyExpanded} id="race-standings-card-body">
                                <div className="nested-element-color p-2 rounded-15 w-100 overflow-auto" style={{"border": "0px"}}>
                                {selectedRaceWeekend.standings.users_picks.map((user_picks) => (
                                    <Link className="race-standings-row p-1 link-no-decorations rounded-15 clickable" to={`/users/${user_picks.user.username}?page=1`} key={user_picks.user.username} style={{marginRight: "0px"}}>
                                        {user_picks.position_change > 0 && 
                                        <span className="race-standings-position-change">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-caret-up-fill" viewBox="0 0 16 16">
                                                <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                                            </svg>
                                        </span>
                                        }
                                        {user_picks.position_change == 0 && <span className="race-standings-position-change" style={{color: "grey"}}> -</span>}
                                        {user_picks.position_change < 0 &&
                                        <span className="race-standings-position-change">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                                                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                            </svg>
                                        </span>
                                        }
                                        <span className="race-standings-position ms-2">{user_picks.position}</span>
                                        <span className="race-standings-username ms-1">{user_picks.user.username}</span>
                                        <span className="race-standings-points">{user_picks.points}</span>
                                    </Link>))
                                }
                                </div>
                            </Expand>
                        </div>
                            
                    </div>}
                </div>
            </div>
        </div>

        <CommentsContextProvider parentElement={{id: selectedRaceWeekend.id, type: "RACE_WEEKEND"}}>
            <CommentsSection />
        </CommentsContextProvider>
        </>
    );
}