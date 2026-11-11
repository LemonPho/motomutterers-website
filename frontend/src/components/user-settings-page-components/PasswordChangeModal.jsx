import React, { useState } from "react";
import { useApplicationContext } from "../ApplicationContext";
import { getToken } from "../fetch-utils/fetchGet";
import { submitChangePassword } from "../fetch-utils/fetchPost";
import { enterKeySubmit } from "../utils";
import { useOpenersContext } from "../OpenersContext";
import ChangeModalBody from "./ChangeModalBody";

export default function PasswordChangeModal(){
    const {setLogout, setErrorMessage, setSuccessMessage, resetApplicationMessages} = useApplicationContext();
    const { closeModal } = useOpenersContext();

    const [ newPassword, setNewPassword ] = useState("");
    const [ oldPassword, setOldPassword ] = useState("");

    const [oldPasswordInvalid, setOldPasswordInvalid] = useState(false);
    const [newPasswordInvalid, setNewPasswordInvalid] = useState(false);

    async function postNewPassword(){
        setOldPasswordInvalid(false);
        setNewPasswordInvalid(false);
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
            if(!passwordResponse.newPasswordValid) setNewPasswordInvalid(true);
            if(!passwordResponse.currentPasswordCorrect) setOldPasswordInvalid(true);
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
        <ChangeModalBody title={"Change password"} submitFunction={postNewPassword}
            firstFieldPlaceholder={"Current password"} firstFieldValue={oldPassword} firstFieldType={"password"} firstFieldInvalid={oldPasswordInvalid} setFirstFieldValue={setOldPassword}
            secondFieldPlaceholder={"New password"} secondFieldValue={newPassword} secondFieldType={"text"} secondFieldInvalid={newPasswordInvalid} setSecondFieldValue={setNewPassword}
        />
    );
}