import React, { useEffect } from "react";
import { useRaceResultsContext } from "./RaceResultsContext";
import { useApplicationContext } from "../ApplicationContext";
import ProfilePictureLazyLoader from "../util-components/ProfilePictureLazyLoader";
import { autoResizeTextarea, toggleCardBody } from "../utils";
import CommentsSection from "../util-components/comments-section-components/CommentsSection";
import CommentsContextProvider from "../util-components/comments-section-components/CommentsSectionContext";

export default function RaceResultPage({ raceId }){

    const { user, userLoading } = useApplicationContext();
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
                <div className="card element-background-color element-border-color mb-2 rounded-15" id="race-result-card">
                    <div className="card-header loading-placeholder">
                        <h5 className="fade-in-out"></h5>
                    </div>
                </div>

                <div className="card element-background-color element-border-color mb-2 rounded-15" id="standings-card">
                    <div className="card-header loading-placeholder">
                        <h5 className="fade-in-out"></h5>
                    </div>
                </div>
            </div>
            
        );
    }

    return(
        <div>
            <div className="card rounded-15 element-background-color element-border-color mb-2" id="race-result-card">
                <div className="card-header rounded-15 clickable" onClick={(e) => {toggleCardBody("race-positions-card-body")}}>
                    <div className="d-flex align-items-center p-1">
                        <h5 style={{margin: "0px"}}>
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
                <div className="card-body custom-card-body" id="race-positions-card-body">
                    <div className="row g-0 p-1" style={{marginRight: "0"}}>
                        <strong className="col-2">Pos</strong>
                        <strong className="col-2">#</strong>
                        <strong className="col-6">Name</strong>
                        <strong className="col-2">Points</strong>
                    </div>

                    {raceResultDetails.finalized && raceResultDetails.competitors_positions.map((competitor_position) => (
                        <div className="row g-0 p-1" key={`competitor-${competitor_position.competitor_id}`} style={{marginRight: "0px"}}>                                       
                            {competitor_position.position == 0 && <span className="col-2">-</span>}
                            {competitor_position.position != 0 && <span className="col-2">{competitor_position.position}</span>}                     
                            <span className="col-2">#{competitor_position.number}</span>
                            <span className="col-6">{competitor_position.first} {competitor_position.last}</span>
                            <span className="col-2">{competitor_position.points}</span>
                        </div>
                    ))}

                    {!raceResultDetails.finalized && raceResultDetails.qualifying_positions.map((qualifying_position) => (
                        <div className="row g-0 p-1" key={`competitor-${qualifying_position.competitor_id}`} style={{marginRight: "0px"}}>                                       
                            {qualifying_position.position == 0 && <span className="col-2">-</span>}
                            {qualifying_position.position != 0 && <span className="col-2">{qualifying_position.position}</span>}                     
                            <span className="col-2">#{qualifying_position.number}</span>
                            <span className="col-6">{qualifying_position.first} {qualifying_position.last}</span>
                            <span className="col-2">-</span>
                        </div>
                    ))}
                </div>
            </div>
            {raceResultDetails.finalized && 
            <div className="card rounded-15 element-background-color element-border-color mb-2" id="race-standings-card">
                <div className="card-header rounded-15 clickable" onClick={(e) => {toggleCardBody("race-standings-card-body")}}>
                    <div className="p-1">
                        <h5 style={{margin: "0px"}}>Standings</h5>
                    </div>
                    
                </div>
                <div className="card-body custom-card-body" id="race-standings-card-body">
                    {raceResultDetails.standings.users_picks.map((user_picks) => (
                        <a className="race-standings-row p-1 link-no-decorations rounded-15 clickable" href={`/users/${user_picks.user.username}?page=1`} key={`user-picks-${user_picks.user.id}`} style={{marginRight: "0px"}}>
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
                                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                </svg>
                            </span>
                            }
                            <span className="race-standings-position">{user_picks.position}</span>
                            <span className="race-standings-username">{user_picks.user.username}</span>
                            <span className="race-standings-points">{user_picks.points}</span>
                        </a>
                    ))

                    }
                </div>
            </div>
            }
            <CommentsContextProvider parentElement={{id: raceId, type: "RACE"}}>
                <CommentsSection />
            </CommentsContextProvider>
        </div>
        
    );
}