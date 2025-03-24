import React, { useEffect, useState } from "react";
import ProfilePictureLazyLoader from "../util-components/ProfilePictureLazyLoader";
import { getScreenDimensions } from "../utils";

export default function Standing({ userPicks, i, loading, small }){

    const [screenWidth, setScreenWidth] = useState(getScreenDimensions().width);

    useEffect(() => {
        const handleWidthResize = () => {
            setScreenWidth(getScreenDimensions().width);
        };
        window.addEventListener("resize", handleWidthResize);
        return(() => {
            window.removeEventListener("resize", handleWidthResize);
        })
    }, [screenWidth]);
    
    if(loading){
        return(
            <div className="p-2 rounded-15 nested-element-color">
                <div className="d-flex align-items-center">
                    {!small && <span className="fading-circle" style={{ width: "3.5rem", height: "3.5rem" }}></span>}
                    {small && <span className="fading-circle" style={{ width: "2rem", height: "2rem" }}></span>}
                    <div className="ms-1 loading-placeholder"><strong className="fade-in-out"></strong></div>
                </div>
            </div>
        )
    } else {
        if(small){
            return(
                <div className="p-2 rounded-15 nested-element-color">
                <div className="d-flex align-items-center">
                    <ProfilePictureLazyLoader width="2rem" height="2rem" username={userPicks.user.username}/>
                    <div className="ms-1"><strong>{i+1}. {userPicks.user.username} - {userPicks.points}</strong></div>
                </div>
            </div>
            )
        } else {
            return(
                <div className="p-2 rounded-15 nested-element-color">
                    <div className="d-flex align-items-center">
                        <ProfilePictureLazyLoader width="3.5rem" height="3.5rem" username={userPicks.user.username}/>
                        <div className="ms-1"><strong>{i+1}. {userPicks.user.username} - {userPicks.points}</strong></div>
                    </div>
                    <div className="d-flex align-items-center">
                        {screenWidth > 500 && userPicks.picks.map((pick) => (
                            <div className="me-1" style={{fontSize: "0.75rem"}} key={`user-${userPicks.user.id}-pick-${pick.competitor_id}`}><strong>{pick.first[0]}. {pick.last.slice(0,3)}</strong> - {pick.points}</div>
                        ))}
        
                        {(screenWidth > 500 && userPicks.independent_pick != null) && <div className="me-1" style={{fontSize: "0.75rem"}}><strong>| I: {userPicks.independent_pick.first[0]}. {userPicks.independent_pick.last.slice(0,3)}</strong> - {userPicks.independent_pick.points}</div>}
                        {(screenWidth > 500 && userPicks.rookie_pick != null) && <div className="me-1" style={{fontSize: "0.75rem"}}><strong>| R: {userPicks.rookie_pick.first[0]}. {userPicks.rookie_pick.last.slice(0,3)}</strong> - {userPicks.rookie_pick.points}</div>}
                    </div>
                </div>
            )
        }
    }
}