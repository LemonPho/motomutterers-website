import React from "react";
import { useStandingsContext } from "./StandingsContext";
import ProfilePictureLazyLoader from "../util-components/ProfilePictureLazyLoader";

export default function StandingDetailed(){
    const { userPicksDetailed, userPicksDetailedLoading, selectedSeason } = useStandingsContext();

    return(
        <div className="custom-modal hidden" id="user-picks-detailed-modal" onClick={(e) => {e.stopPropagation()}}>
            {!userPicksDetailedLoading && console.log(userPicksDetailed)}
            {!userPicksDetailedLoading &&
            <a className="p-2 custom-modal-header d-flex align-items-center link-no-decorations clickable rounded-15" href={`/users/${userPicksDetailed.user.username}?page=1`}>
                <ProfilePictureLazyLoader width="5rem" height="5rem" format={userPicksDetailed.user.profile_picture_format} base64={userPicksDetailed.user.profile_picture_data}/>
                <h3 className="ms-4">{userPicksDetailed.user.username} - {userPicksDetailed.points}</h3>
            </a>}
            {userPicksDetailedLoading && 
            <div className="p-2 custom-modal-header d-flex align-items-center">
                <ProfilePictureLazyLoader width="5rem" height="5rem" format={false} base64={false}/>
                <h3 className="ms-4 fade-in-out"></h3>
            </div>}

            <hr />
            {userPicksDetailedLoading && 
                <ul className="list-group">
                    <li className="list-group-item fade-in-out">                              </li>
                    <li className="list-group-item fade-in-out">                              </li>
                    <li className="list-group-item fade-in-out">                              </li>
                    <li className="list-group-item fade-in-out">                              </li>
                    <li className="list-group-item fade-in-out">                              </li>
                    <li className="list-group-item fade-in-out">                              </li>
                    <li className="list-group-item fade-in-out">                              </li>
                </ul>
            }

            {!userPicksDetailedLoading &&
            <ul className="custom-modal-body d-flex list-group">
                {userPicksDetailed.picks.map((pick) => (
                <li className="list-group-item" id={`pick-${pick.position}`} key={`pick-${pick.position}`}>
                    <strong>{pick.position}. </strong>{pick.competitor_points.competitor.first} {pick.competitor_points.competitor.last} - {pick.competitor_points.points}
                </li>
                ))}
                {selectedSeason.top_independent && 
                <li className="list-group-item" id="pick-independent">
                    <strong>Independent. </strong> {userPicksDetailed.independent_pick.competitor_points.competitor.first} {userPicksDetailed.independent_pick.competitor_points.competitor.last} - {userPicksDetailed.independent_pick.competitor_points.points}
                </li>}
                {selectedSeason.top_rookie && 
                <li className="list-group-item" id="pick-rookie">
                    <strong>Rookie. </strong> {userPicksDetailed.rookie_pick.competitor_points.competitor.first} {userPicksDetailed.rookie_pick.competitor_points.competitor.last} - {userPicksDetailed.rookie_pick.competitor_points.points}
                </li>}
            </ul>}
            
        </div>
    );
}