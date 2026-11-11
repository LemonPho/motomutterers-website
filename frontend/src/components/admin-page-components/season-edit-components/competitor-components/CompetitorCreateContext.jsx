import React, { useState, useContext, createContext } from "react";
import { Outlet } from "react-router-dom";

const CompetitorCreateContext = createContext();

//context is used for creating and editing competitors
export default function CompetitorCreateContextProvider(){
    //Variables used for competitor data
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [number, setNumber] = useState(0);
    const [points, setPoints] = useState(0);
    const [rookie, setRookie] = useState(false);
    const [independent, setIndependent] = useState(false);
    const [id, setId] = useState(0);

    return(
        <CompetitorCreateContext.Provider value={{
            first, last, number, points, rookie, independent, id,
            setFirst, setLast, setNumber, setPoints, setRookie, setIndependent, setId,
        }}>

            <Outlet />
        </CompetitorCreateContext.Provider>
    );
}

export function useCompetitorCreateContext(){
    return useContext(CompetitorCreateContext);
}