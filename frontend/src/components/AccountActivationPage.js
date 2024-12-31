import React, { useEffect, useState } from "react";
import { getLoggedIn } from "./fetch-utils/fetchGet";
import { requestAccountActivationToken, submitAccountActivation } from "./fetch-utils/fetchPost";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useApplicationContext } from "./ApplicationContext";

function AccountActivation(){
    const location = useLocation();
    const navigate = useNavigate();

    const { setSuccessMessage, setErrorMessage, setLoadingMessage } = useApplicationContext();

    const [uid, setUid] = useState(new URLSearchParams(location.search).get("uid"));
    const [token, setToken] = useState(new URLSearchParams(location.search).get("token"));

    const [accountActivated, setAccountActivated] = useState(null);


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

        if(activateAccountResponse.status != 200 || activateAccountResponse.error){
            setErrorMessage(`There was an error activating the account`);
            setAccountActivated(false);
            return;
        }

        setSuccessMessage("Account activated");
        navigate("/");
    }

    useEffect(() => {
        async function fetchData(){
            await activateAccount();
        }
        fetchData();
    }, []);
    

    if(!accountActivated){
        return(
            <div className="card w-100">
                <div className="card-body">
                    <button className="btn btn-link" onClick={requestNewActivationToken}>Request new activation link</button>
                </div>
            </div>
        );
    }
}

export default AccountActivation;