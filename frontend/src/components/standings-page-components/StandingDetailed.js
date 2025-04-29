import React from "react";
import { useStandingsContext } from "./StandingsContext";
import ProfilePictureLazyLoader from "../util-components/ProfilePictureLazyLoader";
import { useApplicationContext } from "../ApplicationContext";
import { Link } from "react-router-dom";

export default function StandingDetailed(){
    const { errorMessage } = useApplicationContext();
    const { userPicksDetailed, userPicksDetailedLoading, selectedSeason } = useStandingsContext();

    return(
        <div className="custom-modal" id="user-picks-detailed-modal" onClick={(e) => {e.stopPropagation()}}>
            {errorMessage && <div className="alert alert-danger"><small>{errorMessage}</small></div>}
            {!userPicksDetailedLoading &&
            <Link className="p-2 custom-modal-header d-flex align-items-center link-no-decorations clickable rounded-15" to={`/users/${userPicksDetailed.user.username}?page=1`}>
                <ProfilePictureLazyLoader width="5rem" height="5rem" user={userPicksDetailed.user}/>
                <h3 className="ms-4">{userPicksDetailed.user.username} - {userPicksDetailed.points}</h3>
            </Link>}
            {userPicksDetailedLoading && 
            <div className="p-2 custom-modal-header d-flex align-items-center">
                <ProfilePictureLazyLoader width="5rem" height="5rem" user={false}/>
                <div className="loading-placeholder">
                    <h3 className="w-100 ms-4 fade-in-out"></h3>
                </div>
            </div>}

            <hr />
            {userPicksDetailedLoading && 
                <ul className="list-group">
                    <div style={{height: "40px"}}>
                        <li className="list-group-item fade-in-out"></li>
                    </div>
                    <div style={{height: "40px"}}>
                        <li className="list-group-item fade-in-out"></li>
                    </div>
                    <div style={{height: "40px"}}>
                        <li className="list-group-item fade-in-out"></li>
                    </div>
                    <div style={{height: "40px"}}>
                        <li className="list-group-item fade-in-out"></li>
                    </div>
                    <div style={{height: "40px"}}>
                        <li className="list-group-item fade-in-out"></li>
                    </div>
                    <div style={{height: "40px"}}>
                        <li className="list-group-item fade-in-out"></li>
                    </div>
                    <div style={{height: "40px"}}>
                        <li className="list-group-item fade-in-out"></li>
                    </div>
                </ul>
            }

            {!userPicksDetailedLoading &&
            <ul className="custom-modal-body d-flex list-group">
                {userPicksDetailed.picks.map((pick) => (
                <li className="list-group-item" id={`pick-${pick.position}`} key={`pick-${pick.position}`}>
                    <strong>{pick.position}. </strong>{pick.first} {pick.last} - {pick.points}
                </li>
                ))}
                {userPicksDetailed.independent_pick && 
                <li className="list-group-item" id="pick-independent">
                    <strong>Independent. </strong> {userPicksDetailed.independent_pick.first} {userPicksDetailed.independent_pick.last} - {userPicksDetailed.independent_pick.points}
                </li>}
                {userPicksDetailed.rookie_pick && 
                <li className="list-group-item" id="pick-rookie">
                    <strong>Rookie. </strong> {userPicksDetailed.rookie_pick.first} {userPicksDetailed.rookie_pick.last} - {userPicksDetailed.rookie_pick.points}
                </li>}
            </ul>}
            
        </div>
    );
}