import React from "react";
import { useCompetitorCreateContext } from "./CompetitorCreateContext";

export default function CompetitorEditModal(){
    const { 
        first, last, number, points, rookie, independent, id,
        setFirst, setLast, setNumber, setPoints, setRookie, setIndependent, setId,
     } = useCompetitorCreateContext();

    return(
        <div>
            This is the competitor edit modal
        </div>
    );
}