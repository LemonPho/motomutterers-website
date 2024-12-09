import React, { useEffect, useState } from "react";
import { getLoggedIn } from "./fetch-utils/fetchGet";
import { requestAccountActivationToken, submitAccountActivation } from "./fetch-utils/fetchPost";
import { useLocation } from "react-router-dom";
import { useApplicationContext } from "./ApplicationContext";

function AccountActivation(){
    const location = useLocation();

    const { setSuccessMessage, setErrorMessage, setLoadingMessage } = useApplicationContext();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errorOcurred, setErrorOcurred] = useState(false);

    const [accountActivated, setAccountActivated] = useState(null);

    const [uid, setUid] = useState(new URLSearchParams(location.search).get("uid"));
    const [token, setToken] = useState(new URLSearchParams(location.search).get("token"))


    async function requestNewActivationToken(){
        setLoadingMessage("Loading...");
        const requestActivationTokenResponse = await requestAccountActivationToken(uid);
        setLoadingMessage(false);

        if(requestActivationTokenResponse.status == 200){
            setSuccessMessage("New activation email sent");
            return;
        }

        if(requestActivationTokenResponse.status == 404){
            setErrorMessage("Account was not found");
            return;
        }

        if(requestActivationTokenResponse.status == 500){
            setErrorMessage("There was a problem sending the new email");
            return;
        }

        if(requestActivationTokenResponse.status == 400){
            setErrorMessage("There has been an error");
            return;
        }

    }

    async function activateAccount(){
        const activateAccountResponse = await submitAccountActivation(uid, token);

        setErrorOcurred(activateAccountResponse.error);
        setAccountActivated(activateAccountResponse.status === 200);
    }

    async function retrieveLoggedIn(){
        const loggedInResponse = await getLoggedIn();
        setIsLoggedIn(loggedInResponse.loggedIn);
    }

    useEffect(() => {
        async function fetchData(){
            await activateAccount();
            await retrieveLoggedIn();
        }
        fetchData();
    }, []);
    

    if(isLoggedIn === true){
        return(
            <div>Account successfully activated!</div>
        );
    } else {
        return(
            <div>Activation link expired, <button className="btn btn-link" onClick={requestNewActivationToken}>resend activation email</button></div>
        )
    }
}

export default AccountActivation;