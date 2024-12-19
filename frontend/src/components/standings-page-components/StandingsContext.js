import React, { useContext, createContext, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getSeasonSimple, getSeasonsSimpleYear, getUserPicks, getUsersProfilePictures, getSeasonStandings, getUserPicksSimple } from "../fetch-utils/fetchGet";
import { useApplicationContext } from "../ApplicationContext";

const StandingsContext = createContext();

export default function StandingsContextProvider(){
    const { setErrorMessage } = useApplicationContext();

    const [standings, setStandings] = useState({});
    const [standingsLoading, setStandingsLoading] = useState(true);
    const [profilePicturesLoading, setProfilePicturesLoading] = useState(true);
    const [userPicksDetailed, setUserPicksDetailed] = useState({});
    const [userPicksDetailedLoading, setUserPicksDetailedLoading] = useState(true);

    const [seasonList, setSeasonList] = useState([]);
    const [seasonListLoading, setSeasonListLoading] = useState(true);
    const [selectedSeason, setSelectedSeason] = useState({});
    const [selectedSeasonLoading, setSelectedSeasonLoading] = useState(true);

    async function retrieveStandings(){
        setStandingsLoading(true);
        const params = new URLSearchParams(location.search);
        const seasonYear = params.get("season");

        const usersStandingsResponse = await getSeasonStandings(seasonYear);

        if(usersStandingsResponse.error){
            setErrorMessage("There was an error retrieving the standings");
            return;
        }

        if(usersStandingsResponse.status === 200){
            setStandings(usersStandingsResponse.standings);
            setStandingsLoading(false);
        }
    }

    async function retrieveProfilePictures(){
        if(!standings || Object.keys(standings).length == 0 || standings.users_picks.length == 0){
            return;
        }

        const users = standings.users_picks.map(user_picks => user_picks.user);
        const profilePicturesResponse = await getUsersProfilePictures(users);

        if(profilePicturesResponse.status !== 200){
            setErrorMessage("There was an error loading the profile pictures");
            return;
        }

        const updatedUsersPicks = standings.users_picks.map((userPicks, index) => {
            const updatedUser = {
              ...userPicks.user,
              profile_picture: profilePicturesResponse.users[index].profile_picture,
            };
          
            return {
              ...userPicks,
              user: updatedUser,
            };
        });
        let updatedStandings = standings;
        updatedStandings.users_picks = updatedUsersPicks;

        setStandings(updatedStandings);
        setProfilePicturesLoading(false);
    }

    async function retrieveSelectedSeason(){
        setSelectedSeasonLoading(true);
        const params = new URLSearchParams(location.search);
        const seasonYear = params.get("season");

        const seasonResponse = await getSeasonSimple(seasonYear);

        if(seasonResponse.error){
            setErrorMessage("There was an error retrieving season data");
            return;
        }

        if(seasonResponse.status != 200){
            setErrorMessage("Be sure to select a valid season");
            return;
        }

        setSelectedSeason(seasonResponse.season);
        setSelectedSeasonLoading(false);
    }

    async function retrieveSeasonList(){
        setSeasonListLoading(true);
        const seasonListResponse = await getSeasonsSimpleYear();

        if(seasonListResponse.error || seasonListResponse.status != 200){
            setErrorMessage("There was an error retrieving the season list");
            return;
        }

        setSeasonList(seasonListResponse.seasons);
        setSeasonListLoading(false);
    }

    async function retrieveUserPicks(userId){
        setUserPicksDetailedLoading(true);
        const userPicksResponse = await getUserPicksSimple(selectedSeason.id, userId);

        if(userPicksResponse.error){
            setErrorMessage("There was an error retrieving the user picks");
            return;
        }

        if(userPicksResponse.status == 404){
            setErrorMessage("The user picks was not found");
            return;
        }

        if(userPicksResponse.status == 200){
            const profilePictureResponse = await getUsersProfilePictures(userPicksResponse.userPicks.user);

            if(profilePictureResponse.error){
                setErrorMessage("There was an error loading the profile picture");
                return;
            }

            if(profilePictureResponse.status == 404){
                setErrorMessage("User profile picture was not found");
                return;
            }

            if(profilePictureResponse.status == 200){
                userPicksResponse.userPicks.user.profile_picture = profilePictureResponse.users[0].profile_picture;
                setUserPicksDetailed(userPicksResponse.userPicks);
                setUserPicksDetailedLoading(false);
            }
           
        }
    }
    
    return(
        <StandingsContext.Provider value={{
            retrieveStandings, retrieveSelectedSeason, retrieveSeasonList, retrieveUserPicks, retrieveProfilePictures,
            standings, userPicksDetailed, seasonList, selectedSeason,
            standingsLoading, userPicksDetailedLoading, seasonListLoading, selectedSeasonLoading, profilePicturesLoading,
        }}>
            <Outlet />
        </StandingsContext.Provider>
    );
}

export function useStandingsContext(){
    return useContext(StandingsContext);
}