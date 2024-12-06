import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";

import { submitNewPassword } from "./fetch-utils/fetchPost";
import { useApplicationContext } from "./ApplicationContext";

export default function ChangePassword(){
    const [errorOccured , setErrorOccured] = useState(false);
    const [tokenValid, setTokenValid] = useState(null);
    const [passwordChanged, setPasswordChanged] = useState(null);
    const [passwordValid, setPasswordValid] = useState(null);
    const [passwordsMatch, setPasswordsMatch] = useState(null);
    const [changePasswordLoading, setChangePasswordLoading] = useState(false);

    const { setErrorMessage, setSuccessMessage } = useApplicationContext();

    const location = useLocation();

    async function changePassword(){
        setChangePasswordLoading(true);
        const params = new URLSearchParams(location.search);
        const uid = params.get("uid");
        const token = params.get("token");

        const password1 = document.getElementById("password1").value;
        const password2 = document.getElementById("password2").value;

        const changePasswordResponse = await submitNewPassword(password1, password2, uid, token);

        console.log(changePasswordResponse);

        if(changePasswordResponse.error){
            setErrorMessage("There was an error when submiting the new password");
            setChangePasswordLoading(false);
            return;
        }

        if(changePasswordResponse.status === 400){
            let message = changePasswordResponse.passwordsMatch ? "" : "Passwords don't match\n";
            message += changePasswordResponse.passwordValid ? "" : "Password is not valid, it needs to be at least 8 characters and not 'simple'\n";
            message += changePasswordResponse.tokenValid ? "" : "The URL used is no longer valid, please restart the process\n";
            setErrorMessage(message);
            setChangePasswordLoading(false);
            return;
        }

        if(changePasswordResponse.status === 200){
            setSuccessMessage("Password successfully changed, you may login now");
            setChangePasswordLoading(false);
            return;
        }

        setChangePasswordLoading(false);
        setErrorMessage("There was a server error when submiting the new password");
    }

    return(
        <div>
            {changePasswordLoading && <div className="alert alert-secondary m-1">Loading...</div>}
            <div className="card shadow mx-auto my-5 rounded-15" style={{width: "21rem"}}>
                <div className="my-3" style={{display: "flex"}}> 
                    <h6 style={{margin: "auto", fontSize: "40px"}}>New Password</h6>
                </div>
                <hr className="mt-2"/>
                <div className="input-group px-3 mx-auto">
                    <input type="password" className="form-control" placeholder="New password" id="password1"/>
                </div>
                <div className="input-group mt-3 px-3 mx-auto">
                    <input type="password" className="form-control" placeholder="Confirm password" id="password2"/>
                </div>
                <div className="input-group mt-3 mb-3 px-3 mx-auto">
                    <button className="btn btn-primary btn-block" onClick={changePassword}>Change</button>
                </div>
            </div>
        </div>
        
    )
}