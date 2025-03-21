import React, { useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import UserInformation from "./UserInformation";
import UserComments from "./UserComments";
import { useApplicationContext } from "../ApplicationContext";

export default function UserPage(){
    const { setErrorMessage } = useApplicationContext();
    const { username } = useParams();
    const [usernameState, setUsernameState] = useState(username);
    const location = useLocation();

    if(username == null){
        setErrorMessage("There was an error loading the page");
        return;
    }

    useEffect(() => {
        setUsernameState(username);
    }, [location]);

    return(
        <div className="row">
            <UserInformation username={usernameState}/>
            <UserComments username={username}/>
        </div>
    );
}