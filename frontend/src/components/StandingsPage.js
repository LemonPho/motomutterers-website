import React, { useState, useEffect } from "react";

import { useApplicationContext } from "./ApplicationContext";
import { getSeasons, getSeason, getUsersStandings } from "./fetch-utils/fetchGet";
import { toggleDropdown } from "./utils";

export default function Standings(){
    const { setErrorMessage, setLoadingMessage, modalErrorMessage, setModalErrorMessage, contextLoading } = useApplicationContext();

    const [seasonYear, setSeasonYear] = useState();

    const [selectedSeason, setSelectedSeason] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [standings, setStandings] = useState({});

    const [loading, setLoading] = useState(true);

    async function retrieveStandings(){
        const params = new URLSearchParams(location.search);
        let tempSeasonYear = params.get("season")
        setSeasonYear(tempSeasonYear);

        const usersStandingsResponse = await getUsersStandings(tempSeasonYear);

        if(usersStandingsResponse.error){
            setErrorMessage("There was an error retrieving the standings");
            return;
        }

        if(usersStandingsResponse.status === 200){
            setStandings(usersStandingsResponse.users);
        }

        const seasonResponse = await getSeason(tempSeasonYear);

        if(seasonResponse.error){
            setErrorMessage("There was an error retrieving the season");
            return;
        }

        if(seasonResponse.status === 404){
            setErrorMessage("Season doesn't exist");
            return;
        }

        if(seasonResponse.status === 200){
            setSelectedSeason(seasonResponse.season);
            return;
        }
    }

    async function retrieveSeasons(){
        let seasonsResponse = await getSeasons();

        if(seasonsResponse.error){
            console.log(seasonsResponse.error);
            setErrorMessage("There was an error loading the seasons");
            return;
        }

        setSeasons(seasonsResponse.seasons);
    }

    useEffect(() => {
        async function fetchData(){
            setLoadingMessage("Loading...");
            await retrieveStandings();
            await retrieveSeasons();
            setLoading(false);
            setLoadingMessage(false);
        }

        fetchData();
    }, [])

    if(loading){
        return;
    }

    return (
    <div className="card rounded-15 my-2 mt-4 align-middle">
        <div className="rounded-15-top card-header">
            <div className="d-flex align-items-center">
                <h5 className="m-0">
                    Standings
                </h5>
                {selectedSeason.finalized &&
                    <small>‎ (finalized)</small>
                }
                <div className="ms-auto dropdown">
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" onClick={(e) => {toggleDropdown("season-selector-dropdown", e)}}>
                        {seasonYear}
                    </button>
                    <ul className="dropdown-menu" id="season-selector-dropdown">
                    {seasons.map((season) => (
                        <li className="ms-2" key={`${season.year}`}>
                            <a className="d-flex align-items-center" href={`/standings?season=${season.year}`} id={`${season.year}`}>
                                {season.year}
                                {season.year == seasonYear && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ms-auto me-1 bi bi-check" viewBox="0 0 16 16">
                                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                                    </svg>
                                )}
                            </a>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        </div>
        <div className="card-body">
            {!standings ? 
            (<div>There are no standings for this season</div>) : 
            (standings.map((standing, i) => (
                <a className="mb-2 link-no-decorations" key={`standings-user-${standing.user.username}`} href={`/users/${standing.user.username}?page=1`}>
                    <div className="d-flex align-items-center">
                        <img className="rounded-circle" style={{width: "3.5rem", height: "3.5rem"}} src={`data: image/${standing.user.profile_picture_format}; base64, ${standing.user.profile_picture_data}`} alt="" />
                        <div className="ms-1"><strong>{i+1}. {standing.user.username} - {standing.points}</strong></div>
                    </div>
                    <div className="d-flex align-items-center">
                        {standing.picks.map((pick) => (
                            <div className="me-1" style={{fontSize: "0.75rem"}} key={`user-${standing.user.id}-pick-${pick.id}`}><strong>{pick.competitor_points.competitor.first[0]}. {pick.competitor_points.competitor.last.slice(0,3)}</strong> - {pick.competitor_points.points}</div>
                        ))}
                        <div className="me-1" style={{fontSize: "0.75rem"}}><strong>{standing.independent_pick.competitor_points.competitor.first[0]}. {standing.independent_pick.competitor_points.competitor.last.slice(0,3)}</strong> - {standing.independent_pick.competitor_points.points}</div>
                    </div>
                    <hr />
                </a>
            )))}
        </div>
    </div>);
}