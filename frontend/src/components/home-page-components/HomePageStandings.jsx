import React, { useEffect, useState } from "react";
import { useApplicationContext } from "../ApplicationContext";
import { getSeasonStandings } from "../fetch-utils/fetchGet";
import Standing from "../standings-page-components/Standing";
import { Link } from "react-router-dom";
import useImagesContext from "../ImagesContext";

export default function Standings({ loading }){
    const { currentSeason, currentSeasonLoading, setErrorMessage } = useApplicationContext();
    const { prepareProfilePictures } = useImagesContext();

    const [standings, setStandings] = useState(null);
    const [standingsLoading, setStandingsLoading] = useState(true);

    async function retrieveStandings(){
        setStandingsLoading(true);
        const standingsResponse = await getSeasonStandings(currentSeason.year, 5);
        setStandingsLoading(false);

        if(standingsResponse.error || standingsResponse.status != 200){
            setErrorMessage("There has been an error retrieving the standigns");
            return;
        }

        setStandings(standingsResponse.standings);
        const userList = standingsResponse.standings.users_picks.map(user_pick => user_pick.user);
        prepareProfilePictures(userList);
    }

    useEffect(() => {
        if(currentSeasonLoading){
            return;
        }

        async function fetchData(){
            await retrieveStandings();
        }

        fetchData();
    }, [currentSeasonLoading]);

    if(loading || standingsLoading || currentSeasonLoading){
        return(
            <div className="card rounded-15 element-background-color element-border-color">
                <div className="card-header rounded-15-top nested-element-color loading-placeholder">
                    <h4 className="fade-in-out"></h4>
                </div>
                <div>
                    <Standing loading={true}/>
                </div>
            </div>
        );
    } else {
        return(
            <div className="card rounded-15 element-background-color element-border-color">
                <Link className="card-header rounded-15-top clickable nested-element-color link-no-decorations" to={`/standings?season=${currentSeason.year}`}>
                    <h4>Standings</h4>
                </Link>
                <Link className="card-body link-no-decorations" to={`/standings?season=${currentSeason.year}`}>
                    {standings && standings.users_picks.length != 0 && standings.users_picks.map((userPicks, i) => (
                        <div key={`standings-user-${userPicks.user.username}`} className="mb-1 rounded-15">
                            <Standing userPicks={userPicks} i={i} small={true}/>
                        </div>
                    )) }
                </Link>
            </div>
        );
    }
}