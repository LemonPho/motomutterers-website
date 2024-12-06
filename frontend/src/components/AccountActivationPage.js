import React, { useEffect, useState } from "react";
import { getLoggedIn } from "./fetch-utils/fetchGet";
import { submitAccountActivation } from "./fetch-utils/fetchPost";
import { useLocation } from "react-router-dom";

function AccountActivation(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errorOcurred, setErrorOcurred] = useState(false);

    const [accountActivated, setAccountActivated] = useState(null);

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const uid = params.get("uid");
        const token = params.get("token");

        async function activateAccount(){
            const activateAccountResponse = await submitAccountActivation(uid, token);

            setErrorOcurred(activateAccountResponse.error);
            setAccountActivated(activateAccountResponse.status === 200);
        }
        activateAccount();
    }, []);

    useEffect(() => {
        async function retrieveLoggedIn(){
            const loggedInResponse = await getLoggedIn();
            setIsLoggedIn(loggedInResponse.loggedIn);
        }

        retrieveLoggedIn();
    }, [accountActivated])
    

    if(isLoggedIn === true){
        return(
            <div>Account successfully activated!</div>
        );
    } else if(errorOcurred){
        return(
            <div>Error has occured, please contact an admin</div>
        )
    }
}

export default AccountActivation;