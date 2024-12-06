import React, { useEffect, useState } from "react";
import { submitEmailActivation } from "./fetch-utils/fetchPost";
import { useLocation } from "react-router-dom";

function EmailActivation(){
    const [errorOcurred, setErrorOcurred] = useState(false);

    const [emailActivated, setEmailActivated] = useState(null);

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const uid = params.get("uid");
        const token = params.get("token");
        const newEmail = params.get("email");

        async function activateEmail(){
            console.log("uid: ", uid);
            console.log("token: ", token);
            console.log("new email: ", newEmail);
            const activateEmailResponse = await submitEmailActivation(uid, token, newEmail);

            setErrorOcurred(activateEmailResponse.error);
            setEmailActivated(activateEmailResponse.emailActivated);
        }
        activateEmail();
    }, []);

    if(emailActivated){
        return(
            <div>Email was successfully activated, you may continue to use the website</div>
        );
    } 

    if(errorOcurred){
        return(
            <div>There was an error during activation, please try again or contact admin</div>
        )
    }
}

export default EmailActivation;