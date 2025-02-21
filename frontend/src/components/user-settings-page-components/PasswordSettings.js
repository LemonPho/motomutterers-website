import React, { useEffect, useState } from "react";

import { submitChangePassword } from "../fetch-utils/fetchPost";
import { getToken } from "../fetch-utils/fetchGet";
import { enterKeySubmit } from "../utils";
import { useNavigate } from "react-router-dom";
import { useApplicationContext } from "../ApplicationContext";

export default function PasswordSettings(){
    const {setLogout, contextLoading, setErrorMessage, setSuccessMessage, resetApplicationMessages} = useApplicationContext();

    const [ newPassword, setNewPassword ] = useState("");
    const [ oldPassword, setOldPassword ] = useState("");

    function resetVariables(){
        setNewPassword("");
        setOldPassword("");
    }

    async function postNewPassword(){
        const tokenResponse = await getToken();
        let token;

        if(tokenResponse.error){
            setErrorMessage("There was an error while submiting the new password");
            console.log(error);
            return;
        }

        token = tokenResponse.token

        const passwordResponse = await submitChangePassword(token, oldPassword, newPassword);

        if(passwordResponse.error){
            setErrorMessage("There was an error submiting the new password");
            return;
        }

        if(passwordResponse.status === 400){
            let message = passwordResponse.newPasswordValid ? "" : "The password must be at least 8 characters and not easy to guess\n";
            message += passwordResponse.currentPasswordCorrect ? "" : "The current password is not correct\n"
            setErrorMessage(message);
            return;
        }

        if(passwordResponse.status === 200){
            setSuccessMessage("The new password has been saved, log into your account again");
            closeModals();
            setLogout();
            return;
        }

        setErrorMessage("There was an error submiting the new password");
    }

    function handleNewPasswordChange(event){
        setNewPassword(event.target.value);
    }

    function handleOldPasswordChange(event){
        setOldPassword(event.target.value);
    }

    if(contextLoading){
        return(null);
    }

    return(
        <div>
            <div className="p-3 d-flex justify-content-center">
                <div>
                    <strong style={{fontSize: "20px"}}>Password</strong>
                    <div>••••••••••</div>
                </div>
                <button id="password-button" className="btn btn-outline-secondary rounded-15 align-self-center ms-auto" onClick={(e) => {resetApplicationMessages();resetVariables();toggleModal("password-modal", e)}}>Change</button>
                <div className="custom-modal" id="password-modal" onClick={(e) => {e.stopPropagation();}}>
                    <div className="custom-modal-header">                                
                        <h5>Change password</h5>
                        <button type="button" className="ms-auto btn btn-link link-no-decorations" id="close-modal" onClick={() => {closeModals(); resetApplicationMessages();}}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="custom-modal-body">
                        <input data-category="input-field" type="password" placeholder="Current password" className="form-control" id="old-password-input" onChange={(e) => {handleOldPasswordChange(e)}} onKeyUp={(e) => enterKeySubmit(e, postNewPassword)}/>
                        <input data-category="input-field" type="password" placeholder="New password" className="form-control mt-2" id="new-password-input" onChange={(e) => {handleNewPasswordChange(e)}} onKeyUp={(e) => enterKeySubmit(e, postNewPassword)}/>
                    </div>
                    <div className="custom-modal-footer">
                        <button id="submit-data" className="btn btn-primary mr-auto" onClick={(e) => {e.stopPropagation(); resetApplicationMessages(); postNewPassword();}}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}