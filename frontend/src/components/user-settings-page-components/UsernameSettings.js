import React, { useState, useEffect, useContext } from "react";

import { submitChangeUsername } from "../fetch-utils/fetchPost";
import { getCurrentUser } from "../fetch-utils/fetchGet";

import ApplicationContext, { useApplicationContext } from "../ApplicationContext";
import { toggleModal, closeModals, enterKeySubmit } from "../utils";

export default function UsernameSettings(){
    const [errorOcurred, setErrorOcurred] = useState(false);

    const [newUsernameValid, setNewUsernameValid] = useState(null);
    const [newUsernameUnique, setNewUsernameUnique] = useState(null);
    const [userCanChangeUsername, setUserCanChangeUsername] = useState(null);
    const [changeUsernameSuccess, setChangeUsernameSuccess] = useState(null);
    const [changeUsernameLoading, setChangeUsernameLoading] = useState(false);

    const {user, contextLoading, modalErrorMessage, setErrorMessage, setModalErrorMessage, setSuccessMessage, resetApplicationMessages, retrieveUserData} = useApplicationContext();

    const [currentPasswordCorrect, setCurrentPasswordCorrect] = useState(null);
    
    async function postNewUsername(){
        setChangeUsernameLoading(true);
        
        const newUsername = document.getElementById("username-input").value;
        const currentPassword = document.getElementById("password-username-input").value;

        const usernameResponse = await submitChangeUsername(currentPassword, newUsername);

        if(usernameResponse.error){
            setModalErrorMessage("There was an error while submiting the new username");
            setChangeUsernameLoading(false);
            return;
        }

        if(usernameResponse.status === 400){
            let message = usernameResponse.newUsernameValid ? "" : "Username is not valid, make sure to only use numbers and letters\n";
            message += usernameResponse.newUsernameUnique ? "" : "Username is already in use\n";
            message += usernameResponse.userCanChangeUsername ? "" : "You must wait 30 days in between switching usernames\n";
            message += usernameResponse.currentPasswordCorrect ? "" : "Password is incorrect\n";
            setChangeUsernameLoading(false);
            setModalErrorMessage(message);
            return;
        }

        if(usernameResponse.status === 200){
            setSuccessMessage("The new username has been saved");
            setChangeUsernameLoading(false);
            closeModals();
            retrieveUserData();
            return;
        }

        setModalErrorMessage("There has been an error while submiting the new username");
        setChangeUsernameLoading(false);
    }

    if(contextLoading){return null;}


    return(
        <div>
            <div className="p-3 d-flex justify-content-center">
                <div className="container">
                    <strong style={{fontSize: "20px"}}>Username</strong>
                    <div>{user.username}</div>
                </div>
                <button id="username-button" className="btn btn-outline-secondary rounded-15 align-self-center ml-auto" onClick={(e) => toggleModal("username-modal", e)}>Change</button>
                <div className="custom-modal hidden" id="username-modal" onClick={(e) => {e.stopPropagation();}}>
                    <div className="custom-modal-header">                                
                        <h5>Change username</h5>
                        <button type="button" className="btn btn-link link-no-decorations ms-auto" id="close-modal" onClick={(e) => {closeModals(); resetApplicationMessages();}}>
                            <span id="close-modal" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="custom-modal-body">
                        {modalErrorMessage && <div className="alert alert-danger" style={{whiteSpace: "pre-line"}}><small>{modalErrorMessage}</small></div>}
                        {changeUsernameLoading === true && <div className="alert alert-secondary"><div className="d-flex justify-content-center align-items-center">Loading...</div></div>}
                        <input type="password" placeholder="Current password" className="form-control" id="password-username-input" onKeyUp={(e) => enterKeySubmit(e, postNewUsername)}/>
                        <input type="text" placeholder="New username" className="form-control mt-2" id="username-input" onKeyUp={(e) => enterKeySubmit(e, postNewUsername)}/>
                    </div>
                    <div className="custom-modal-footer">
                        <button id="submit-data" className="btn btn-primary mr-auto" onClick={(e) => {e.stopPropagation(); resetApplicationMessages(); postNewUsername();}}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}