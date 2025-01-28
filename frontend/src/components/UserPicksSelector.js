import React, { useState, useEffect } from "react";
import { getSeason, getUserPicks, getUsersPicksState } from "./fetch-utils/fetchGet";
import { useApplicationContext } from "./ApplicationContext";
import { toggleDropdown } from "./utils";
import { submitUserPicks } from "./fetch-utils/fetchPost";

export default function UserPicksSelector(){
    const { setErrorMessage, addErrorMessage, setSuccessMessage, setLoadingMessage, currentSeason, currentSeasonLoading, loggedIn, user, userLoading, selectPicksState, selectPicksStateLoading } = useApplicationContext();

    const [invalidPicks, setInvalidPicks] = useState([0, 0, 0, 0, 0])
    const [loading, setLoading] = useState(true);
    const [newUserPicksLoading, setNewUserPicksLoading] = useState(false);
    const [userPicks, setUserPicks] = useState([0, 0, 0, 0, 0]);
    const [userIndependentPick, setUserIndependentPick] = useState(false);
    const [invalidIndependent, setInvalidIndependent] = useState(false);
    const [userRookiePick, setUserRookiePick] = useState(false);
    const [invalidRookie, setInvalidRookie] = useState(false);
    const [picksWords, setPicksWords] = useState(["1st", "2nd", "3rd", "4th", "5th"]);
    const [season, setSeason] = useState(false);
    const [seasonLoading, setSeasonLoading] = useState();

    function resetInvalidPicks(){
        setInvalidPicks([0, 0, 0, 0, 0]);
        setInvalidRookie(false);
        setInvalidIndependent(false);
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
        setNewUserPicksLoading(true);
        let picks = userPicks.map(pick => pick.competitor_points.competitor.id);
        let picksResponse;
        if(season.top_independent && season.top_rookie){
            picksResponse = await submitUserPicks(picks, userIndependentPick.competitor_points.competitor.id, userRookiePick.competitor_points.competitor.id);
        } else if(season.top_independent){
            picksResponse = await submitUserPicks(picks, userIndependentPick.competitor_points.competitor.id);
        } else if(season.top_rookie){
            picksResponse = await submitUserPicks(picks, userRookiePick.competitor_points.competitor.id);
        } else {
            picksResponse = await submitUserPicks(picks);
        }
        resetInvalidPicks();
        setNewUserPicksLoading(false);

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
            if(picksResponse.cantSelectPicks){
                setErrorMessage("You already have picks that participated in one or more races!");
                return;
            }

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
                setInvalidIndependent(true);
                addErrorMessage("Selected independent rider is not an independent rider");
            }

            if(picksResponse.invalidRookie){
                setInvalidRookie(true);
                addErrorMessage("Selected rookie is not rookie");
            }
        }
    }

    async function retrieveSeason(){
        if(season || currentSeasonLoading){
            return;
        }

        setSeasonLoading(true);
        const seasonResponse = await getSeason(currentSeason.year);

        if(seasonResponse.error){
            setErrorMessage("There was an error retrieving the current season");
            return;
        }

        if(seasonResponse.status == 200){
            setSeason(seasonResponse.season);
            setSeasonLoading(false);
        }
    }
    
    async function retrieveUserPicks(){
        if(currentSeasonLoading){
            return;
        }

        if(!userLoading && !user.is_logged_in){
            setErrorMessage("You need to be logged in to select your picks");
            return;
        }

        const userPicksResponse = await getUserPicks(currentSeason.id, user.id);

        console.log(userPicksResponse);

        if(userPicksResponse.error){
            setErrorMessage("There has been an error loading the selected picks");
            console.log(userPicksResponse.error);
            return;
        }

        if(userPicksResponse.userPicks){
            // Sort the userPicks based on the 'position' field
            const sortedUserPicks = userPicksResponse.userPicks.picks.sort((a, b) => a.position - b.position).map(pick => pick);
            setUserPicks(sortedUserPicks);
            if(userPicksResponse.userPicks.independent_pick != null){
                setUserIndependentPick(userPicksResponse.userPicks.independent_pick);
            }
            if(userPicksResponse.userPicks.rookie_pick != null){
                setUserRookiePick(userPicksResponse.userPicks.rookie_pick);
            }
        }
    }

    useEffect(() => {
        setLoading(true);
        retrieveUserPicks();
        retrieveSeason();
        setLoading(false);
        setLoadingMessage(false);
    }, [currentSeasonLoading, userLoading]);

    if(!season){
        return null;
    }

    return (
        <div className="card rounded-15 element-background-color element-border-color">
            <div className="card-header d-flex justify-content-center">
                <h3>Season: {season.year}</h3>
            </div>

            <div className="card-body">
                {(!loading) && userPicks.map((userPick, i) => (
                    invalidPicks[i] == true ? (
                        <div className="col d-flex justify-content-center" key={`${picksWords[i]}-pick-dropdown-div`}>
                            <div className="card text-center mb-2 rounded-15">
                                <div className="card-header">
                                    <h5 className="card-title text-muted">{picksWords[i]} Pick</h5>
                                </div>
                                <div className="card-body" style={{padding: "8px"}}>
                                    <div className="dropdown p-2">
                                        <button className="btn btn-outline-danger dropdown-toggle rounded-15" id={`${picksWords[i]}-pick-button`} onClick={(e) => toggleDropdown(`${picksWords[i]}-pick-dropdown`, e, loggedIn)}>
                                            {userPicks[i] != 0 && <span>{userPicks[i].competitor_points.competitor.first} {userPicks[i].competitor_points.competitor.last}</span>}
                                            {userPicks[i] == 0 && <span>{picksWords[i]} Pick</span>}
                                        </button>
                                        <ul className="dropdown-menu" id={`${picksWords[i]}-pick-dropdown`} style={{overflowY: "scroll", maxHeight: "15rem"}}>
                                            {(!seasonLoading) && season.competitors_sorted_number.map((competitor_position) => (
                                                <li key={`competitor-${competitor_position.competitor_points.competitor.id}`}><a className="dropdown-item" onClick={() => {addUserPick(i, competitor_position)}}>{competitor_position.competitor_points.competitor.first} {competitor_position.competitor_points.competitor.last}</a></li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="col d-flex justify-content-center" key={`${picksWords[i]}-pick-dropdown-div`}>
                            <div className="card text-center mb-2 rounded-15">
                                <div className="card-header">
                                    <h5 className="card-title text-muted">{picksWords[i]} Pick</h5>
                                </div>

                                <div className="card-body" style={{padding: "8px"}}>
                                    <div className="dropdown p-2">
                                        <button className="btn btn-outline-secondary dropdown-toggle rounded-15" id={`${picksWords[i]}-pick-button`} onClick={(e) => toggleDropdown(`${picksWords[i]}-pick-dropdown`, e, loggedIn)}>
                                            {userPicks[i] != 0 && <span>{userPicks[i].competitor_points.competitor.first} {userPicks[i].competitor_points.competitor.last}</span>}
                                            {userPicks[i] == 0 && <span>{picksWords[i]} Pick</span>}
                                        </button>
                                        <ul className="dropdown-menu" id={`${picksWords[i]}-pick-dropdown`} style={{overflowY: "scroll", maxHeight: "15rem"}}>
                                            {(!seasonLoading) && season.competitors_sorted_number.map((competitor_position) => (
                                                <li key={`competitor-${competitor_position.competitor_points.competitor.id}`}><a className="dropdown-item" onClick={() => {addUserPick(i, competitor_position)}}><small>#{competitor_position.competitor_points.competitor.number}</small> {competitor_position.competitor_points.competitor.first} {competitor_position.competitor_points.competitor.last}</a></li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                ))}
                {(!loading && currentSeason.top_independent) && 
                <div className="col d-flex justify-content-center" key={`independent-pick-dropdown-div`}>
                    <div className="card text-center mb-2 rounded-15">
                        <div className="card-header">
                            <h5 className="card-title text-muted">Independent Pick</h5>
                        </div>

                        <div className="card-body" style={{padding: "8px"}}>
                            <div className="dropdown p-2">
                                {invalidIndependent == true && 
                                <button className="btn btn-outline-danger dropdown-toggle rounded-15" id={`independent-pick-button`} onClick={(e) => toggleDropdown(`independent-pick-dropdown`, e, loggedIn)}>
                                    {userIndependentPick != 0 && <span>{userIndependentPick.competitor_points.competitor.first} {userIndependentPick.competitor_points.competitor.last}</span>}
                                    {userIndependentPick == 0 && <span>Independent Pick</span>}
                                </button>}

                                {invalidIndependent == false &&
                                <button className="btn btn-outline-secondary dropdown-toggle rounded-15" id={`independent-pick-button`} onClick={(e) => toggleDropdown(`independent-pick-dropdown`, e, loggedIn)}>
                                    {userIndependentPick != 0 && <span>{userIndependentPick.competitor_points.competitor.first} {userIndependentPick.competitor_points.competitor.last}</span>}
                                    {userIndependentPick == 0 && <span>Independent Pick</span>}
                                </button>}
                                
                                <ul className="dropdown-menu" id={`independent-pick-dropdown`} style={{overflowY: "scroll", maxHeight: "15rem"}}>
                                    {(!seasonLoading) && season.competitors_sorted_number.map((competitor_position) => (
                                        (competitor_position.independent && <li key={`competitor-${competitor_position.competitor_points.competitor.id}`}><a className="dropdown-item" onClick={() => {setUserIndependentPick(competitor_position)}}><small>#{competitor_position.competitor_points.competitor.number}</small> {competitor_position.competitor_points.competitor.first} {competitor_position.competitor_points.competitor.last}</a></li>)
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>}

                {(!loading && currentSeason.top_rookie) && 
                <div className="col d-flex justify-content-center" key={`rookie-pick-dropdown-div`}>
                    <div className="card text-center mb-2 rounded-15">
                        <div className="card-header">
                            <h5 className="card-title text-muted">Rookie Pick</h5>
                        </div>

                        <div className="card-body" style={{padding: "8px"}}>
                            <div className="dropdown p-2">
                                {invalidRookie == true && 
                                <button className="btn btn-outline-danger dropdown-toggle rounded-15" id={`rookie-pick-button`} onClick={(e) => toggleDropdown(`rookie-pick-dropdown`, e, loggedIn)}>
                                    {userRookiePick != 0 && <span>{userRookiePick.competitor_points.competitor.first} {userRookiePick.competitor_points.competitor.last}</span>}
                                    {userRookiePick == 0 && <span>Rookie Pick</span>}
                                </button>}

                                {invalidRookie == false &&
                                <button className="btn btn-outline-secondary dropdown-toggle rounded-15" id={`rookie-pick-button`} onClick={(e) => toggleDropdown(`rookie-pick-dropdown`, e, loggedIn)}>
                                    {userRookiePick != 0 && <span>{userRookiePick.competitor_points.competitor.first} {userRookiePick.competitor_points.competitor.last}</span>}
                                    {userRookiePick == 0 && <span>Rookie Pick</span>}
                                </button>}
                                
                                <ul className="dropdown-menu" id={`rookie-pick-dropdown`} style={{overflowY: "scroll", maxHeight: "15rem"}}>
                                    {(!seasonLoading) && season.competitors_sorted_number.map((competitor_position) => (
                                        (competitor_position.rookie && <li key={`competitor-${competitor_position.competitor_points.competitor.id}`}><a className="dropdown-item" onClick={() => {setUserRookiePick(competitor_position)}}><small>#{competitor_position.competitor_points.competitor.number}</small> {competitor_position.competitor_points.competitor.first} {competitor_position.competitor_points.competitor.last}</a></li>)
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
            
           <div className="card-footer d-flex justify-content-center">
                {newUserPicksLoading && <button className="btn btn-primary rounded-15" disabled>Loading...</button>}
                {!newUserPicksLoading && <button className="btn btn-primary rounded-15" onClick={() => submitPicks()}>Submit</button>}
            </div>
        </div>
    );
}