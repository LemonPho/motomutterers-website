import React, { useState } from "react";
import { useApplicationContext } from "../ApplicationContext";
import { getToken } from "../fetch-utils/fetchGet";
import { submitChangePassword } from "../fetch-utils/fetchPost";
import { enterKeySubmit } from "../utils";
import { useOpenersContext } from "../OpenersContext";

export default function PasswordChangeModal(){
    const {setLogout, setErrorMessage, setSuccessMessage, resetApplicationMessages} = useApplicationContext();
    const { closeModal } = useOpenersContext();

    const [ newPassword, setNewPassword ] = useState("");
    const [ oldPassword, setOldPassword ] = useState("");

    async function postNewPassword(){
        const tokenResponse = await getToken();
        let token;

        if(tokenResponse.error){
            setErrorMessage("There was an error while submiting the new password");
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
            setLogout();
            return;
        }

        setErrorMessage("There was an error submiting the new password");
    }

    return(
        <div className="custom-modal" id="password-modal" onClick={(e) => {e.stopPropagation();}}>
            <div className="custom-modal-header">                                
                <h5>Change password</h5>
            </div>
            <div className="custom-modal-body">
                <input data-category="input-field" type="password" placeholder="Current password" className="form-control" id="old-password-input" onChange={(e) => setOldPassword(e.target.value)} onKeyUp={(e) => enterKeySubmit(e, postNewPassword)}/>
                <input data-category="input-field" type="password" placeholder="New password" className="form-control mt-2" id="new-password-input" onChange={(e) => setNewPassword(e.target.value)} onKeyUp={(e) => enterKeySubmit(e, postNewPassword)}/>
            </div>
            <div className="custom-modal-footer dflex flex-column">
                <button id="submit-data" className="btn btn-primary mr-auto rounded-15 w-100" onClick={(e) => {e.stopPropagation(); postNewPassword();}}>Save changes</button>
                <button id="close-password-change" className="btn btn-outline-danger rounded-15 w-100 mt-1" onClick={() => closeModal()}>Cancel</button>
            </div>
        </div>
    );
}