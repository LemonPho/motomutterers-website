import React, { useState } from "react";
import { useApplicationContext } from "../ApplicationContext";
import { submitChangeEmail } from "../fetch-utils/fetchPost";
import { enterKeySubmit } from "../utils";
import { useOpenersContext } from "../OpenersContext";

export default function EmailChangeModal(){
    const [ newEmail, setNewEmail ] = useState("");
    const [ passwordInput, setPasswordInput ] = useState("");
    const { setErrorMessage, setSuccessMessage, retrieveUserData, resetApplicationMessages, setLoadingMessage } = useApplicationContext();
    const { closeModal } = useOpenersContext();


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
            return;
        }

        let message = emailResponse.newEmailUnique ? "" : "Email is not unique\n";
        message += emailResponse.newEmailValid ? "" : "Email is not valid\n";
        message += emailResponse.currentPasswordCorrect ? "" : "Password is not correct\n";
        setErrorMessage(message);
    }


    return(
        <div className="custom-modal" id="email-modal" onClick={(e) => {e.stopPropagation();}}>
            <div className="custom-modal-header">                                
                <h5>Change email</h5>
            </div>
            <div className="custom-modal-body">
                <input type="password" data-category="input-field" placeholder="Current password" className="form-control" id="password-email-input" onChange={(e) => setPasswordInput(e.target.value)} onKeyUp={(e) => enterKeySubmit(e, postNewEmail)}/>
                <input type="text" data-category="input-field" placeholder="New email" className="form-control mt-2" id="email-input" onChange={(e) => setNewEmail(e.target.value)} onKeyUp={(e) => enterKeySubmit(e, postNewEmail)}/>
            </div>
            <div className="custom-modal-footer dflex flex-column">
                <button id="submit-data" className="btn btn-primary rounded-15 w-100" onClick={(e) => {e.stopPropagation(); postNewEmail();}}>Save changes</button>
                <button id="close-email-change" className="btn btn-outline-danger rounded-15 w-100 mt-1" onClick={() => closeModal()}>Cancel</button>
            </div>
        </div>
    );
}