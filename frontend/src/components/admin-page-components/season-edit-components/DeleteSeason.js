import React, { useEffect, useState } from "react";
import { useSeasonContext } from "./SeasonContext";

export default function DeleteSeason(){
    const { season, deleteSeason } = useSeasonContext();


    return(
        <div className="d-flex align-items-center w-100 ps-1">
            <strong>Delete season</strong>
            <div className="ms-auto">
                <button className="btn btn-outline-danger" onClick={(e) => {deleteSeason();}}>
                    Delete season
                </button>
            </div>
        </div>
    );
}