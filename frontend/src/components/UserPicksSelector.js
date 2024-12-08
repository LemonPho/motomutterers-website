import React, { useState, useEffect } from "react";
import { getUserPicks, getUsersPicksState } from "./fetch-utils/fetchGet";
import { useApplicationContext } from "./ApplicationContext";
import { toggleDropdown } from "./utils";
import { submitUserPicks } from "./fetch-utils/fetchPost";

export default function UserPicksSelector(){
    const { setErrorMessage, addErrorMessage, setSuccessMessage, setLoadingMessage, currentSeason, competitorsSortedNumber, loggedIn, user, contextLoading, selectPicksState } = useApplicationContext();

    const [invalidPicks, setInvalidPicks] = useState([0, 0, 0, 0, 0, 0, 0])
    const [loading, setLoading] = useState(true);
    const [userPicks, setUserPicks] = useState([0, 0, 0, 0, 0]);
    const [userIndependentPick, setUserIndependentPick] = useState(null);
    const [userRookiePick, setUserRookiePick] = useState(null);
    const [picksWords, setPicksWords] = useState(["1st", "2nd", "3rd", "4th", "5th"]);

    function resetInvalidPicks(){
        setInvalidPicks([0, 0, 0, 0, 0, 0, 0]);
    }

    function addUserPick(position, competitor) {
        setUserPicks((prevUserPicks) => {
            const newUserPicks = [...prevUserPicks];
    
            newUserPicks[position] = competitor;
        
            return newUserPicks;
        });
    }

    function addInvalidPicks(invalidPicks){
        setInvalidPicks(() => {
            const newInvalidPicks = [...invalidPicks];
            return newInvalidPicks;
        })
    }

    async function submitPicks(){
        setLoadingMessage("Loading...");
        let picks = userPicks.map(pick => pick.id);
        const picksResponse = await submitUserPicks(picks, userIndependentPick.id, userRookiePick.id);
        resetInvalidPicks();
        setLoadingMessage(false);

        if(picksResponse.error){
            setErrorMessage("There has been an error submiting the picks.");
            console.log(picksResponse.error);
            return;
        }

        if(picksResponse.status === 201){
            setSuccessMessage("The picks have been successfully submited.");
            return;
        }

        if(picksResponse.status === 400){
            if(picksResponse.picksAlreadySelected){
                setErrorMessage("Another user already has the same picks and order.");
                return;
            }
    
            if(picksResponse.invalidPicks){
                for(let i = 0; i < picksResponse.invalidPicks.length; i++){
                    if(picksResponse.invalidPicks[i] === true){
                        setErrorMessage("Highlighted picks are invalid");
                    }
                }
    
                addInvalidPicks(picksResponse.invalidPicks);
            }

            if(picksResponse.invalidIndependent){
                if(!picksResponse.invalidPicks){
                    addInvalidPicks([false, false, false, false, false, true, false])
                } else {
                    picksResponse.invalidPicks.push(true);
                    addInvalidPicks(picksResponse.invalidPicks);
                }
                addErrorMessage("Selected independent rider is not an independent rider");
                return;
            }

            if(picksResponse.invalidRookie){
                if(!picksResponse.invalidPicks){
                    addInvalidPicks([false, false, false, false, false, false, true])
                } else {
                    picksResponse.invalidPicks.push(true);
                    addInvalidPicks(picksResponse.invalidPicks);
                }
                addErrorMessage("Selected rookie is not rookie");
                return;
            }

            setErrorMessage("There was an error submiting the picks");
        }
    }
    
    async function retrieveUserPicks(){
        const userPicksResponse = await getUserPicks(currentSeason.id);

        if(userPicksResponse.error){
            setErrorMessage("There has been an error loading the selected picks");
            console.log(userPicksResponse.error);
            return;
        }

        if(userPicksResponse.userPicks != null){
            let tempUserPicks = [];
            //sorting the picks based on position, they dont arrive sorted
            for(let i = 0; i < 6; i++){
                for(let j = 0; j < 6; j++){
                    if(userPicksResponse.userPicks[j].position == i){
                        tempUserPicks[i] = userPicksResponse.userPicks[i].competitor_points.competitor;
                    }
                }
            }
            setUserPicks(tempUserPicks);
            if(userPicksResponse.independentPick != null){
                setUserIndependentPick(userPicksResponse.independentPick.competitor_points.competitor);
            }
            if(userPicksResponse.rookiePick != null){
                setUserRookiePick(userPicksResponse.rookiePick.competitor_points.competitor);
            }
        }
    }

    useEffect(() => {
        setLoadingMessage("Loading...");
        retrieveUserPicks();
        setLoading(false);
        setLoadingMessage(false);
    }, []);

    if(loading || contextLoading){
        return null;
    }

    if(!loggedIn){
        return <div>You need to be logged in to select your picks.</div>
    }

    if(!selectPicksState){
        return <div>You can not select your picks at this moment.</div>
    }

    return (
        <div className="card mt-4 rounded-15">
            <div className="card-header d-flex justify-content-center">
                <h3>Season: {currentSeason.year}</h3>
            </div>

            <div className="card-body">
                {userPicks.map((userPick, i) => (
                    invalidPicks[i] == true ? (
                        <div className="col d-flex justify-content-center" key={`${picksWords[i]}-pick-dropdown-div`}>
                            <div className="card text-center mb-2">
                                <div className="card-header">
                                    <h5 className="card-title text-muted">{picksWords[i]} Pick</h5>
                                </div>
                                <div className="card-body" style={{padding: "8px"}}>
                                    <div className="dropdown p-2">
                                        <button className="btn btn-outline-danger dropdown-toggle" id={`${picksWords[i]}-pick-button`} onClick={(e) => toggleDropdown(`${picksWords[i]}-pick-dropdown`, e, loggedIn)}>
                                            {userPicks[i] != 0 && <span>{userPicks[i].first} {userPicks[i].last}</span>}
                                            {userPicks[i] == 0 && <span>{picksWords[i]} Pick</span>}
                                        </button>
                                        <ul className="dropdown-menu" id={`${picksWords[i]}-pick-dropdown`} style={{overflowY: "scroll", maxHeight: "15rem"}}>
                                            {competitorsSortedNumber.map((competitor) => (
                                                <li key={`competitor-${competitor.competitor_points.competitor.id}`}><a className="dropdown-item" onClick={() => {addUserPick(i, competitor.competitor_points.competitor)}}>{competitor.competitor_points.competitor.first} {competitor.competitor_points.competitor.last}</a></li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="col d-flex justify-content-center" key={`${picksWords[i]}-pick-dropdown-div`}>
                            <div className="card text-center mb-2">
                                <div className="card-header">
                                    <h5 className="card-title text-muted">{picksWords[i]} Pick</h5>
                                </div>

                                <div className="card-body" style={{padding: "8px"}}>
                                    <div className="dropdown p-2">
                                        <button className="btn btn-outline-secondary dropdown-toggle" id={`${picksWords[i]}-pick-button`} onClick={(e) => toggleDropdown(`${picksWords[i]}-pick-dropdown`, e, loggedIn)}>
                                            {userPicks[i] != 0 && <span>{userPicks[i].first} {userPicks[i].last}</span>}
                                            {userPicks[i] == 0 && <span>{picksWords[i]} Pick</span>}
                                        </button>
                                        <ul className="dropdown-menu" id={`${picksWords[i]}-pick-dropdown`} style={{overflowY: "scroll", maxHeight: "15rem"}}>
                                            {competitorsSortedNumber.map((competitor) => (
                                                <li key={`competitor-${competitor.competitor_points.competitor.id}`}><a className="dropdown-item" onClick={() => {addUserPick(i, competitor.competitor_points.competitor)}}><small>#{competitor.competitor_points.competitor.number}</small> {competitor.competitor_points.competitor.first} {competitor.competitor_points.competitor.last}</a></li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                ))}
                {currentSeason.top_independent && 
                <div className="col d-flex justify-content-center" key={`independent-pick-dropdown-div`}>
                    <div className="card text-center mb-2">
                        <div className="card-header">
                            <h5 className="card-title text-muted">Independent Pick</h5>
                        </div>

                        <div className="card-body" style={{padding: "8px"}}>
                            <div className="dropdown p-2">
                                {invalidPicks[5] && 
                                <button className="btn btn-outline-danger dropdown-toggle" id={`independent-pick-button`} onClick={(e) => toggleDropdown(`independent-pick-dropdown`, e, loggedIn)}>
                                    {userIndependentPick && <span>{userIndependentPick.first} {userIndependentPick.last}</span>}
                                    {!userIndependentPick && <span>Independent Pick</span>}
                                </button>}

                                {!invalidPicks[5] &&
                                <button className="btn btn-outline-secondary dropdown-toggle" id={`independent-pick-button`} onClick={(e) => toggleDropdown(`independent-pick-dropdown`, e, loggedIn)}>
                                    {userIndependentPick && <span>{userIndependentPick.first} {userIndependentPick.last}</span>}
                                    {!userIndependentPick && <span>Independent Pick</span>}
                                </button>}
                                
                                <ul className="dropdown-menu" id={`independent-pick-dropdown`} style={{overflowY: "scroll", maxHeight: "15rem"}}>
                                    {competitorsSortedNumber.map((competitor) => (
                                        competitor.independent && <li key={`competitor-${competitor.competitor_points.competitor.id}`}><a className="dropdown-item" onClick={() => {addUserPick(i, competitor.competitor_points.competitor)}}><small>#{competitor.competitor_points.competitor.number}</small> {competitor.competitor_points.competitor.first} {competitor.competitor_points.competitor.last}</a></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>}

                {currentSeason.top_rookie && 
                <div className="col d-flex justify-content-center" key={`rookie-pick-dropdown-div`}>
                    <div className="card text-center mb-2">
                        <div className="card-header">
                            <h5 className="card-title text-muted">Rookie Pick</h5>
                        </div>

                        <div className="card-body" style={{padding: "8px"}}>
                            <div className="dropdown p-2">
                                {invalidPicks[6] && 
                                <button className="btn btn-outline-danger dropdown-toggle" id={`rookie-pick-button`} onClick={(e) => toggleDropdown(`rookie-pick-dropdown`, e, loggedIn)}>
                                    {userRookiePick && <span>{userRookiePick.first} {userRookiePick.last}</span>}
                                    {!userRookiePick && <span>Rookie Pick</span>}
                                </button>}

                                {!invalidPicks[6] &&
                                <button className="btn btn-outline-secondary dropdown-toggle" id={`rookie-pick-button`} onClick={(e) => toggleDropdown(`rookie-pick-dropdown`, e, loggedIn)}>
                                    {userRookiePick && <span>{userRookiePick.first} {userRookiePick.last}</span>}
                                    {!userRookiePick && <span>Rookie Pick</span>}
                                </button>}
                                
                                <ul className="dropdown-menu" id={`rookie-pick-dropdown`} style={{overflowY: "scroll", maxHeight: "15rem"}}>
                                    {competitorsSortedNumber.map((competitor) => (
                                        competitor.rookie && <li key={`competitor-${competitor.competitor_points.competitor.id}`}><a className="dropdown-item" onClick={() => {addUserPick(i, competitor.competitor_points.competitor)}}><small>#{competitor.competitor_points.competitor.number}</small> {competitor.competitor_points.competitor.first} {competitor.competitor_points.competitor.last}</a></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
            
            
           <div className="card-footer d-flex justify-content-center">
                <button className="btn btn-primary" onClick={() => submitPicks()}>Submit</button>
            </div>
        </div>
    );
}