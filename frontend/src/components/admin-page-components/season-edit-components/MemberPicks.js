import React, { useState, useEffect } from "react";
import { getUsersPicksState } from "../../fetch-utils/fetchGet";
import { useSeasonContext } from "./SeasonContext";
import { useApplicationContext } from "../../ApplicationContext";
import { submitToggleUsersPicksState } from "../../fetch-utils/fetchPost";

export default function MemberPicks() {
    const { season, retrieveSeason } = useSeasonContext();
    const { setErrorMessage, setSuccessMessage, retrieveCurrentSeason, retrievePicksState, setLoadingMessage } = useApplicationContext();
    const [memberPicksCheckboxState, setMemberPicksCheckboxState] = useState(season.selection_open);

    async function handleToggleUsersPicks() {
        const tempMemberPicksCheckboxState = memberPicksCheckboxState;
        setMemberPicksCheckboxState(!memberPicksCheckboxState);
        if(season.competitors.length == 0){
            setErrorMessage("Be sure to have competitors added before enabling member picks");
            return;
        }

        setLoadingMessage("Loading...");

        const memberPicksResponse = await submitToggleUsersPicksState();

        if (memberPicksResponse.error || memberPicksResponse.status != 200) {
            setMemberPicksCheckboxState(tempMemberPicksCheckboxState);
            setErrorMessage("There was an error toggling the member picks.");
            return;
        }

        setLoadingMessage(false);
        setSuccessMessage(`Member picks successfully ${season.selection_open ? 'disabled' : 'enabled'}.`);
        setMemberPicksCheckboxState(!season.selection_open);
        await retrieveSeason();
        await retrieveCurrentSeason();
        await retrievePicksState();
    }

    return (
        <div className="d-flex align-items-center w-100 ps-1">
            <strong>Enable member picks</strong>
            {(!season.finalized && season.current) &&
            <div className="form-check form-switch ms-auto mb-0">
                <input className="form-check-input" type="checkbox" checked={memberPicksCheckboxState} onChange={handleToggleUsersPicks}/>
            </div>
            }
            {(season.finalized || !season.current) && 
            <div className="form-check form-switch ms-auto mb-0"onClick={(e) => {e.stopPropagation();setErrorMessage("You need to set this season as the current season to enable picks or finalize");}}>
                <input className="form-check-input" type="checkbox" checked={false} disabled/>
            </div>
            }
            
        </div>
    );
}
