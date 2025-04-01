import React, { useState } from "react";
import { useApplicationContext } from "../ApplicationContext";
import { enterKeySubmit } from "../utils";
import { submitChangeUsername } from "../fetch-utils/fetchPost";
import TextInput from "../util-components/TextInput";
import ChangeModalBody from "./ChangeModalBody";

export default function UsernameChangeModal({ closeModal, retrieveUserData }){
    const [passwordInput, setPasswordInput] = useState("");
    const [newUsername, setNewUsername] = useState("");

    const [usernameInvalid, setUsernameInvalid] = useState(false);
    const [passwordInvalid, setPasswordInvalid] = useState(false);

    const { setLoadingMessage, setErrorMessage, setSuccessMessage, resetApplicationMessages } = useApplicationContext();

    async function postNewUsername(){
        resetApplicationMessages();
        setUsernameInvalid(false);
        setPasswordInvalid(false);
        setLoadingMessage("Loading...");     

        const usernameResponse = await submitChangeUsername(passwordInput, newUsername);

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

            if(!usernameResponse.newUsernameUnique || !usernameResponse.newUsernameValid){
                setUsernameInvalid(true);
            }
            if(!usernameResponse.currentPasswordCorrect){
                setPasswordInvalid(true);
            }

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
        <ChangeModalBody 
            title={"Change username"} submitFunction={postNewUsername} 
            firstFieldPlaceholder={"New username"} firstFieldValue={newUsername} firstFieldType={"email"} firstFieldInvalid={usernameInvalid} setFirstFieldValue={setNewUsername}
            secondFieldPlaceholder={"Current password"} secondFieldValue={passwordInput} secondFieldType={"password"} secondFieldInvalid={passwordInvalid} setSecondFieldValue={setPasswordInput}/>
    );
}