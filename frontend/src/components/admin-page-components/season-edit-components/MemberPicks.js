import React, { useState, useEffect } from "react";
import { getUsersPicksState } from "../../fetch-utils/fetchGet";
import { useSeasonContext } from "./SeasonContext";
import { useApplicationContext } from "../../ApplicationContext";
import { submitToggleUsersPicksState } from "../../fetch-utils/fetchPost";

export default function MemberPicks() {
    const { season } = useSeasonContext();
    const { setErrorMessage, setSuccessMessage, selectPicksState, contextLoading, retrievePicksState } = useApplicationContext();
    const [memberPicksCheckboxState, setMemberPicksCheckboxState] = useState(selectPicksState);

    async function handleToggleUsersPicks() {
        if(season.competitors.length == 0){
            setErrorMessage("Be sure to have competitors added before enabling member picks");
            return;
        }

        const memberPicksResponse = await submitToggleUsersPicksState();

        if (memberPicksResponse.error) {
            setErrorMessage("There was an error toggling the member picks.");
            return;
        }

        if (memberPicksResponse.status === 200) {
            setSuccessMessage(`Member picks successfully ${selectPicksState ? 'disabled' : 'enabled'}.`);
            setMemberPicksCheckboxState(!selectPicksState);
            retrievePicksState();
            return;
        }

        setErrorMessage("It was not possible to enable member picks");
    }

    if(contextLoading){
        return;
    }

    return (
        <div className="d-flex align-items-center w-100">
            <strong>Enable member picks</strong>
            {!season.finalized && season.current &&
            <div className="form-check form-switch ms-auto mb-0">
                <input className="form-check-input" type="checkbox" checked={memberPicksCheckboxState} onChange={handleToggleUsersPicks}/>
            </div>
            }
            {season.finalized || !season.current && 
            <div className="form-check form-switch ms-auto mb-0">
                <input className="form-check-input" type="checkbox" checked={false} disabled/>
            </div>
            }
            
        </div>
    );
}
