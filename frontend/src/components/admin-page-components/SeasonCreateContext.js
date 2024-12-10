import React, { createContext, useState, useContext } from "react"
import { Outlet } from "react-router-dom";
import { getSeasonsSimple } from "../fetch-utils/fetchGet";
import { useApplicationContext } from "../ApplicationContext";

const SeasonCreateContext = createContext();

export default function SeasonCreateContextProvider(){

    const { setErrorMessage } = useApplicationContext();

    const [seasonsLoading, setSeasonsLoading] = useState(false);
    const [seasons, setSeasons] = useState([]);

    async function retrieveSeasons(){
        let seasonsResponse = await getSeasonsSimple();

        if(seasonsResponse.error){
            console.log(seasonsResponse.error);
            setErrorMessage("There was an error loading the seasons");
            return;
        }

        setSeasons(seasonsResponse.seasons);
        setSeasonsLoading(false);
    }

    return(
        <SeasonCreateContext.Provider value={{ 
            seasons, seasonsLoading,
            retrieveSeasons,
        }}>

            <Outlet/>
        </SeasonCreateContext.Provider>
    );
}

export function useSeasonCreateContext(){
    return useContext(SeasonCreateContext);
}