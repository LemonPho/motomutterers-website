import React from "react";
import { useSeasonContext } from "./SeasonContext";
import { useApplicationContext } from "../../ApplicationContext";
import { submitCurrentSeason } from "../../fetch-utils/fetchPost";

export default function SetCurrentSeason(){
    const { season, retrieveSeason } = useSeasonContext();
    const { setErrorMessage, setSuccessMessage } = useApplicationContext();

    async function setCurrentSeason(){
        let currentSeasonResponse = await submitCurrentSeason(season.year);

        if(currentSeasonResponse.error){
            console.log(currentSeasonResponse.error);
            setErrorMessage("There was an error submiting the current season");
            return;
        }
        
        setSuccessMessage(`Season: ${season.year} was set as the current season`);
        retrieveSeason();
    }

    return(
        <div className="d-flex align-items-center w-100 ps-1">
            <strong>Set as current season</strong>
            <div className="ms-auto">
                {(!season.current && !season.finalized) && 
                <button className="btn btn-outline-primary" onClick={setCurrentSeason}>
                    Set as current season
                </button>
                }
                {(season.current || season.finalized) && 
                <button className="btn btn-outline-secondary" disabled>
                    Already current season
                </button>
                }
            </div>
        </div>
    );
}