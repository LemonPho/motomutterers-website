import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { submitNewPassword } from "./fetch-utils/fetchPost";
import { useApplicationContext } from "./ApplicationContext";
import { enterKeySubmit } from "./utils";

export default function ChangePassword(){
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const { setErrorMessage, setSuccessMessage, setLoadingMessage } = useApplicationContext();

    const location = useLocation();
    const navigate = useNavigate();

    async function changePassword(){
        setLoadingMessage("Loading...");
        const params = new URLSearchParams(location.search);
        const uid = params.get("uid");
        const token = params.get("token");

        const changePasswordResponse = await submitNewPassword(password, passwordConfirmation, uid, token);

        if(changePasswordResponse.error){
            setErrorMessage("There was an error when submiting the new password");
            setLoadingMessage(false);
            return;
        }

        if(changePasswordResponse.status === 400){
            let message = changePasswordResponse.passwordsMatch ? "" : "Passwords don't match\n";
            message += changePasswordResponse.passwordValid ? "" : "Password is not valid, it needs to be at least 8 characters and not 'simple'\n";
            message += changePasswordResponse.tokenValid ? "" : "The URL used is no longer valid, please restart the process\n";
            setErrorMessage(message);
            setLoadingMessage(false);
            return;
        }

        if(changePasswordResponse.status === 200){
            setSuccessMessage("Password successfully changed, you may login now");
            navigate("/login");
            setLoadingMessage(false);
            return;
        }

        setLoadingMessage(false);
        setErrorMessage("There was a server error when submiting the new password");
    }

    return(
        <div className="card element-background-color element-border-color rounded-15 mx-auto" style={{width: "21rem"}}>
            <div className="card-header"> 
                <h5>New Password</h5>
            </div>
            <div className="card-body">
                <input type="password" className="input-field w-100" placeholder="New password" id="password1" onKeyUp={(e) => {setPassword(e.target.value); enterKeySubmit(e, changePassword)}}/>
                <input type="password" className="input-field mt-2 w-100" placeholder="Confirm password" id="password2" onKeyUp={(e) => {setPasswordConfirmation(e.target.value); enterKeySubmit(e, changePassword)}}/>
            </div>
            <div className="input-group mb-3 px-3 mx-auto">
                <button className="btn btn-primary btn-block rounded-15 w-100" onClick={changePassword}>Change</button>
            </div>
        </div>)
}