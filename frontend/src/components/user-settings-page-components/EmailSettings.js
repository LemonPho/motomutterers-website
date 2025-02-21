import React, { useState, useEffect, useContext } from "react";

import { submitChangeEmail } from "../fetch-utils/fetchPost";
import { getCurrentUser } from "../fetch-utils/fetchGet";

import ApplicationContext, { useApplicationContext } from "../ApplicationContext";
import { enterKeySubmit } from "../utils";

export default function EmailSettings(){
    const [ newEmail, setNewEmail ] = useState("");
    const [ passwordInput, setPasswordInput ] = useState("");
    const {user, contextLoading, setErrorMessage, setSuccessMessage, retrieveUserData, resetApplicationMessages} = useApplicationContext();

    function resetVariables(){
        setNewEmail("");
        setPasswordInput("");
    }

    async function postNewEmail(){
        resetApplicationMessages();
        setLoadingMessage("Loading...");
        const emailResponse = await submitChangeEmail(passwordInput, newEmail);

        if(emailResponse.error){
            setErrorMessage("There was an error while submiting the new email");
            return;
        }

        retrieveUserData();

        if(emailResponse.status === 200){
            setSuccessMessage("Email changed, check your inbox for the verification link");
            closeModals();
            return;
        }

        let message = emailResponse.newEmailUnique ? "" : "Email is not unique\n";
        message += emailResponse.newEmailValid ? "" : "Email is not valid\n";
        message += emailResponse.currentPasswordCorrect ? "" : "Password is not correct\n";
        setErrorMessage(message);
    }

    function handleNewEmailChange(event){
        setNewEmail(event.target.value);
    }

    function handlePasswordInputChange(event){
        setPasswordInput(event.target.value);
    }

    if(contextLoading){
        return null;
    }

    return(
        <div>
            <div className="p-3 d-flex justify-content-center">
                <div>
                    <strong style={{fontSize: "20px"}}>Email</strong>
                    <div>{user.email}</div>
                </div>
                <button id="email-button" className="btn btn-outline-secondary rounded-15 align-self-center ms-auto" onClick={(e) => {toggleModal("email-modal", e);resetVariables();}}>Change</button>
                <div className="custom-modal" id="email-modal" onClick={(e) => {e.stopPropagation();}}>
                    <div className="custom-modal-header">                                
                        <h5>Change email</h5>
                        <button type="button" className="btn btn-link link-no-decorations ms-auto" id="close-modal" onClick={() => {closeModals();}}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="custom-modal-body">
                        <input type="password" data-category="input-field" placeholder="Current password" className="form-control" id="password-email-input" onChange={(e) => {handlePasswordInputChange(e)}} onKeyUp={(e) => enterKeySubmit(e, postNewEmail)}/>
                        <input type="text" data-category="input-field" placeholder="New email" className="form-control mt-2" id="email-input" onChange={(e) => {handleNewEmailChange(e)}} onKeyUp={(e) => enterKeySubmit(e, postNewEmail)}/>
                    </div>
                    <div className="custom-modal-footer">
                        <button id="submit-data" className="btn btn-primary mr-auto" onClick={(e) => {e.stopPropagation(); postNewEmail();}}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}