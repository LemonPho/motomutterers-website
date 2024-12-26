import React, { useState, useEffect, useContext } from "react";

import { submitChangeEmail } from "../fetch-utils/fetchPost";
import { getCurrentUser } from "../fetch-utils/fetchGet";

import ApplicationContext, { useApplicationContext } from "../ApplicationContext";
import { closeModals, enterKeySubmit, toggleModal } from "../utils";

export default function EmailSettings(){
    const [changeEmailLoading, setChangeEmailLoading] = useState(null);
    const {user, contextLoading, setModalErrorMessage, modalErrorMessage, setSuccessMessage, retrieveUserData, resetApplicationMessages} = useApplicationContext();

    async function postNewEmail(){
        resetApplicationMessages();
        setChangeEmailLoading(true);
        const newEmail = document.getElementById("email-input").value;
        const currentPassword = document.getElementById("password-email-input").value;

        const emailResponse = await submitChangeEmail(currentPassword, newEmail);

        if(emailResponse.error){
            setModalErrorMessage("There was an error while submiting the new email");
            setChangeEmailLoading(false);
            return;
        }

        retrieveUserData();

        if(emailResponse.status === 200){
            setSuccessMessage("Email changed, check your inbox for the verification link");
            closeModals();
            setChangeEmailLoading(false);
            return;
        }

        let message = emailResponse.newEmailUnique ? "" : "Email is not unique\n";
        message += emailResponse.newEmailValid ? "" : "Email is not valid\n";
        message += emailResponse.currentPasswordCorrect ? "" : "Password is not correct\n";
        setModalErrorMessage(message);

        setChangeEmailLoading(false);
    }

    if(contextLoading){
        return null;
    }

    return(
        <div>
            <div className="p-3 d-flex justify-content-center">
                <div className="container">
                    <strong style={{fontSize: "20px"}}>Email</strong>
                    <div>{user.email}</div>
                </div>
                <button id="email-button" className="btn btn-outline-secondary rounded-15 align-self-center ml-auto" onClick={(e) => {toggleModal("email-modal", e);}}>Change</button>
                <div className="custom-modal hidden" id="email-modal" onClick={(e) => {e.stopPropagation();}}>
                    <div className="custom-modal-header">                                
                        <h5>Change email</h5>
                        <button type="button" className="btn btn-link link-no-decorations ms-auto" id="close-modal" onClick={() => {closeModals();}}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="custom-modal-body">
                        {modalErrorMessage && <div className="alert alert-danger" style={{whiteSpace: "pre-line"}}>{modalErrorMessage}</div>}
                        {changeEmailLoading === true && <div className="alert alert-secondary"><div className="d-flex justify-content-center align-items-center">Loading...</div></div>}
                        <input type="password" placeholder="Current password" className="form-control" id="password-email-input" onKeyUp={(e) => enterKeySubmit(e, postNewEmail)}/>
                        <input type="text" placeholder="New email" className="form-control mt-2" id="email-input" onKeyUp={(e) => enterKeySubmit(e, postNewEmail)}/>
                    </div>
                    <div className="custom-modal-footer">
                        <button id="submit-data" className="btn btn-primary mr-auto" onClick={(e) => {e.stopPropagation(); postNewEmail();}}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}