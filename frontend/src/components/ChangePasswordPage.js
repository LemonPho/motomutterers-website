import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { submitNewPassword } from "./fetch-utils/fetchPost";
import { useApplicationContext } from "./ApplicationContext";
import TextInput from "./util-components/TextInput";

export default function ChangePassword(){
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [passwordInvalid, setPasswordInvalid] = useState(false);
    const [passwordConfirmationInvalid, setPasswordConfirmationInvalid] = useState(false);

    const [loading, setLoading] = useState(false);

    const { setErrorMessage, setSuccessMessage, setLoadingMessage, resetApplicationMessages } = useApplicationContext();

    const location = useLocation();
    const navigate = useNavigate();

    async function changePassword(){
        resetApplicationMessages();
        setPasswordInvalid(false);
        setPasswordConfirmationInvalid(false);
        setLoadingMessage("Loading...");
        setLoading(true);

        const params = new URLSearchParams(location.search);
        const uid = params.get("uid");
        const token = params.get("token");

        const changePasswordResponse = await submitNewPassword(password, passwordConfirmation, uid, token);
        setLoading(false);
        setLoadingMessage(false);

        if(changePasswordResponse.error){
            setErrorMessage("There was an error when submiting the new password");
            return;
        }

        if(changePasswordResponse.status === 400){
            let message = changePasswordResponse.passwordsMatch ? "" : "Passwords don't match\n";
            message += changePasswordResponse.passwordValid ? "" : "Password is not valid, it needs to be at least 8 characters and not 'simple'\n";
            message += changePasswordResponse.tokenValid ? "" : "The URL used is no longer valid, please restart the process\n";
            if(!changePasswordResponse.passwordsMatch) setPasswordConfirmationInvalid(true); setPasswordInvalid(true);
            if(!changePasswordResponse.passwordValid) setPasswordInvalid(true);
            setErrorMessage(message);
            return;
        }

        if(changePasswordResponse.status === 200){
            setSuccessMessage("Password successfully changed, you may login now");
            navigate("/login");
            return;
        }

        setErrorMessage("There was a server error when submiting the new password");
    }

    return(
        <div className="card element-background-color element-border-color rounded-15 mx-auto" style={{width: "21rem"}}>
            <div className="card-header d-flex justify-content-center rounded-15 nested-element-color m-2"> 
                <h5>New Password</h5>
            </div>
            <div className="card-body rounded-15 nested-element-color m-2">
                <TextInput type="password" className={"mb-2"} placeholder="New password" id="password1" value={password} setValue={setPassword} onEnterFunction={changePassword} outline={passwordInvalid}/>
                <TextInput type="password" className="mb-2" placeholder="Confirm password" id="password2" value={passwordConfirmation} setValue={setPasswordConfirmation} onEnterFunction={changePassword} outline={passwordConfirmationInvalid}/>
                {!loading && <button className="btn btn-primary btn-block rounded-15 w-100" onClick={changePassword}>Change</button>}
                {loading && <button className="btn btn-primary btn-block rounded-15 w-100" disabled>Loading...</button>}
            </div>
        </div>)
}