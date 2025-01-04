import React, { useState, useEffect, useContext } from "react";

import { submitChangeUsername } from "../fetch-utils/fetchPost";
import { getCurrentUser } from "../fetch-utils/fetchGet";

import ApplicationContext, { useApplicationContext } from "../ApplicationContext";
import { toggleModal, closeModals, enterKeySubmit } from "../utils";

export default function UsernameSettings(){
    const {user, contextLoading, setErrorMessage, setLoadingMessage, setSuccessMessage, resetApplicationMessages, retrieveUserData} = useApplicationContext();

    const [newUsername, setNewUsername] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    function resetVariables(){
        setNewUsername("");
        setPasswordInput("");
    }

    async function postNewUsername(){
        setLoadingMessage("Loading...");     
        const newUsername = document.getElementById("username-input").value;
        const currentPassword = document.getElementById("password-username-input").value;

        const usernameResponse = await submitChangeUsername(currentPassword, newUsername);

        if(usernameResponse.error){
            setErrorMessage("There was an error while submiting the new username");
            setLoadingMessage(false);
            return;
        }

        if(usernameResponse.status === 400){
            let message = usernameResponse.newUsernameValid ? "" : "Username is not valid, make sure to only use numbers and letters\n";
            message += usernameResponse.newUsernameUnique ? "" : "Username is already in use\n";
            message += usernameResponse.userCanChangeUsername ? "" : "You must wait 30 days in between switching usernames\n";
            message += usernameResponse.currentPasswordCorrect ? "" : "Password is incorrect\n";
            setLoadingMessage(false);
            setErrorMessage(message);
            return;
        }

        if(usernameResponse.status === 200){
            setSuccessMessage("The new username has been saved");
            setLoadingMessage(false);
            closeModals();
            retrieveUserData();
            return;
        }

        setErrorMessage("There has been an error while submiting the new username");
        setLoadingMessage(false);
    }

    function handleNewUsernameChange(event){
        setNewUsername(event.target.value);
    }

    function handlePasswordInputChange(event){
        setPasswordInput(event.target.value);
    }

    if(contextLoading){return null;}

    return(
        <div>
            <div className="p-3 d-flex justify-content-center">
                <div>
                    <strong style={{fontSize: "20px"}}>Username</strong>
                    <div>{user.username}</div>
                </div>
                <button id="username-button" className="btn btn-outline-secondary rounded-15 align-self-center ms-auto" onClick={(e) => {resetVariables();toggleModal("username-modal", e)}}>Change</button>
                <div className="custom-modal hidden" id="username-modal" onClick={(e) => {e.stopPropagation();}}>
                    <div className="custom-modal-header">                                
                        <h5>Change username</h5>
                        <button type="button" className="btn btn-link link-no-decorations ms-auto" id="close-modal" onClick={(e) => {closeModals(); resetApplicationMessages();}}>
                            <span id="close-modal" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="custom-modal-body">
                        <input data-category="input-field" type="password" placeholder="Current password" className="form-control" id="password-username-input" onChange={(e) => {handlePasswordInputChange(e);}} onKeyUp={(e) => enterKeySubmit(e, postNewUsername)}/>
                        <input data-category="input-field" type="text" placeholder="New username" className="form-control mt-2" id="username-input" onChange={(e) => {handleNewUsernameChange(e)}} onKeyUp={(e) => enterKeySubmit(e, postNewUsername)}/>
                    </div>
                    <div className="custom-modal-footer">
                        <button id="submit-data" className="btn btn-primary mr-auto" onClick={(e) => {e.stopPropagation(); resetApplicationMessages(); postNewUsername();}}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}