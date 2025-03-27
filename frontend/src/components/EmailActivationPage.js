import React, { useEffect, useState } from "react";
import { submitEmailActivation } from "./fetch-utils/fetchPost";
import { Navigate, useLocation } from "react-router-dom";
import { useApplicationContext } from "./ApplicationContext";

function EmailActivation(){
    const { setSuccessMessage, setErrorMessage } = useApplicationContext();
    const [errorOcurred, setErrorOcurred] = useState(false);

    const [emailActivated, setEmailActivated] = useState(null);

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const uid = params.get("uid");
        const token = params.get("token");
        const newEmail = params.get("email");

        async function activateEmail(){
            const activateEmailResponse = await submitEmailActivation(uid, token, newEmail);

            setErrorOcurred(activateEmailResponse.error);
            setEmailActivated(activateEmailResponse.emailActivated);
        }
        activateEmail();
    }, []);

    if(emailActivated){
        setSuccessMessage("Email activated, you can use the website");
        return(
            <div>
                <Navigate replace to="/"/>
            </div>
        );
    } 

    if(errorOcurred){
        setErrorMessage("There was an error activating the email, please try again or send an email to motomutterersfantasyleague@gmail.com")
        return(
            <div>
                <Navigate replace to="/"/>
            </div>
        )
    }
}

export default EmailActivation;