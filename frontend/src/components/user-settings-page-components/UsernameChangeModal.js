import React, { useState } from "react";
import { useApplicationContext } from "../ApplicationContext";
import { enterKeySubmit } from "../utils";
import { submitChangeUsername } from "../fetch-utils/fetchPost";

export default function UsernameChangeModal({ closeModal, retrieveUserData }){
    const [passwordInput, setPasswordInput] = useState("");
    const [newUsername, setNewUsername] = useState("");

    const { setLoadingMessage, setErrorMessage, setSuccessMessage } = useApplicationContext();

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
                await retrieveUserData();
                closeModal();
                return;
            }
    
            setErrorMessage("There has been an error while submiting the new username");
            setLoadingMessage(false);
        }

    return(
        <div className="custom-modal" id="username-modal" onClick={(e) => {e.stopPropagation();}}>
            <div className="custom-modal-header">                                
                <h5>Change username</h5>
            </div>
            <div className="custom-modal-body">
                <input data-category="input-field" type="password" placeholder="Current password" className="form-control" id="password-username-input" onChange={(e) => {setPasswordInput(e.target.value)}} onKeyUp={(e) => enterKeySubmit(e, postNewUsername)}/>
                <input data-category="input-field" type="text" placeholder="New username" className="form-control mt-2" id="username-input" onChange={(e) => {setNewUsername(e.target.value)}} onKeyUp={(e) => enterKeySubmit(e, postNewUsername)}/>
            </div>
            <div className="custom-modal-footer d-flex flex-column">
                <button id="submit-data" className="btn btn-primary rounded-15 w-100" onClick={(e) => {e.stopPropagation(); postNewUsername();}}>Save changes</button>
                <button id="close-username-change" className="btn btn-outline-danger rounded-15 w-100 mt-2" onClick={() => closeModal()}>Cancel</button>
            </div>
        </div>
    );
}