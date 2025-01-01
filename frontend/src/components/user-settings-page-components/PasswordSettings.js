import React, { useEffect, useState } from "react";

import { submitChangePassword } from "../fetch-utils/fetchPost";
import { getToken } from "../fetch-utils/fetchGet";
import { closeModals, enterKeySubmit, toggleModal } from "../utils";
import { useNavigate } from "react-router-dom";
import { useApplicationContext } from "../ApplicationContext";

export default function PasswordSettings(){
    const [changePasswordLoading, setChangePasswordLoading] = useState(null);

    const {setLogout, retrieveUserData, contextLoading, modalErrorMessage, setModalErrorMessage, setSuccessMessage, resetApplicationMessages} = useApplicationContext();


    async function postNewPassword(){
        setChangePasswordLoading(true);
        const newPassword = document.getElementById("password-input").value;
        const currentPassword = document.getElementById("password-password-input").value;
        const tokenResponse = await getToken();
        let token;

        if(tokenResponse.error){
            setModalErrorMessage("There was an error while submiting the new password");
            console.log(error);
            setChangePasswordLoading(false);
            return;
        }

        token = tokenResponse.token

        const passwordResponse = await submitChangePassword(token, currentPassword, newPassword);

        if(passwordResponse.error){
            setModalErrorMessage("There was an error submiting the new password");
            setChangePasswordLoading(false);
            return;
        }

        if(passwordResponse.status === 400){
            let message = passwordResponse.newPasswordValid ? "" : "The password must be at least 8 characters and not easy to guess\n";
            message += passwordResponse.currentPasswordCorrect ? "" : "The current password is not correct\n"
            setModalErrorMessage(message);
            setChangePasswordLoading(false);
            return;
        }

        if(passwordResponse.status === 200){
            setChangePasswordLoading(false);
            setSuccessMessage("The new password has been saved, log into your account again");
            closeModals();
            setLogout();
            return;
        }

        setModalErrorMessage("There was an error submiting the new password");
        setChangePasswordLoading(false);
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
                <button id="password-button" className="btn btn-outline-secondary rounded-15 align-self-center ms-auto" onClick={(e) => {resetApplicationMessages();toggleModal("password-modal", e)}}>Change</button>
                <div className="custom-modal hidden" id="password-modal" onClick={(e) => {e.stopPropagation();}}>
                    <div className="custom-modal-header">                                
                        <h5>Change password</h5>
                        <button type="button" className="ms-auto btn btn-link link-no-decorations" id="close-modal" onClick={() => {closeModals(); resetApplicationMessages();}}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="custom-modal-body">
                        {modalErrorMessage && <div className="alert alert-danger" style={{whiteSpace: "pre-line"}}><small>{modalErrorMessage}</small></div>}
                        {changePasswordLoading === true && <div className="alert alert-secondary"><div className="d-flex justify-content-center align-items-center">Loading...</div></div>}
                        <input type="password" placeholder="Current password" className="form-control" id="password-password-input" onKeyUp={(e) => enterKeySubmit(e, postNewPassword)}/>
                        <input type="password" placeholder="New password" className="form-control mt-2" id="password-input" onKeyUp={(e) => enterKeySubmit(e, postNewPassword)}/>
                    </div>
                    <div className="custom-modal-footer">
                        <button id="submit-data" className="btn btn-primary mr-auto" onClick={(e) => {e.stopPropagation(); resetApplicationMessages(); postNewPassword();}}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}