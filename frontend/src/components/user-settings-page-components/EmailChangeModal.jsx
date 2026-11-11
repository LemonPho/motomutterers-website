import React, { useState } from "react";
import { useApplicationContext } from "../ApplicationContext";
import { submitChangeEmail } from "../fetch-utils/fetchPost";
import { enterKeySubmit } from "../utils";
import { useOpenersContext } from "../OpenersContext";
import TextInput from "../util-components/TextInput";
import ChangeModalBody from "./ChangeModalBody";

export default function EmailChangeModal(){
    const { setErrorMessage, setSuccessMessage, retrieveUserData, resetApplicationMessages, setLoadingMessage } = useApplicationContext();

    const [ newEmail, setNewEmail ] = useState("");
    const [ passwordInput, setPasswordInput ] = useState("");

    const [newEmailInvalid, setNewEmailInvalid] = useState(false);
    const [passwordInvalid, setPasswordInvalid] = useState(false);

    async function postNewEmail(){
        resetApplicationMessages();
        setNewEmailInvalid(false);
        setPasswordInvalid(false);
        setLoadingMessage("Loading...");
        const emailResponse = await submitChangeEmail(passwordInput, newEmail);
        setLoadingMessage(false);

        if(emailResponse.error){
            setErrorMessage("There was an error while submiting the new email");
            return;
        }

        if(emailResponse.status === 200){
            setSuccessMessage("Email changed, check your inbox for the verification link");
            await retrieveUserData();
            return;
        }

        let message = emailResponse.newEmailUnique ? "" : "Email is not unique\n";
        message += emailResponse.newEmailValid ? "" : "Email is not valid\n";
        message += emailResponse.currentPasswordCorrect ? "" : "Password is not correct\n";
        if(!emailResponse.newEmailUnique || !emailResponse.newEmailValid) setNewEmailInvalid(true);
        if(!emailResponse.currentPasswordCorrect) setPasswordInvalid(true);
        setErrorMessage(message);
    }


    return(
        <ChangeModalBody title={"Change email"} submitFunction={postNewEmail}
            firstFieldPlaceholder={"New email"} firstFieldValue={newEmail} firstFieldType={"email"} firstFieldInvalid={newEmailInvalid} setFirstFieldValue={setNewEmail}
            secondFieldPlaceholder={"Current password"} secondFieldValue={passwordInput} secondFieldType={"password"} secondFieldInvalid={passwordInvalid} setSecondFieldValue={setPasswordInput}
        />        
    );
}