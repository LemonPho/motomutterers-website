import React, { useState } from "react";
import { submitDeleteAccount } from "../fetch-utils/fetchPost";
import { useNavigate } from "react-router-dom";
import { useApplicationContext } from "../ApplicationContext";

export default function DeleteAccountModal({ closeModal, retrieveUserData }){
    const {user, setErrorMessage, setSuccessMessage} = useApplicationContext();

    const [inputtedUsername, setInputtedUsername] = useState();
    const navigate = useNavigate();

    async function deleteAccount(){
        if(inputtedUsername != user.username){
            setErrorMessage("Username inputted isn't correct");
            return;
        }

        const deleteAccountResponse = await submitDeleteAccount();

        if(deleteAccountResponse.status == 404){
            setErrorMessage("Account not found");
            return;
        }

        if(deleteAccountResponse.status != 200 || deleteAccountResponse.error){
            setErrorMessage("There was an error deleting your account");
            return;
        }

        setSuccessMessage("Account deleted");
        closeModal();
        await retrieveUserData();
        navigate("/");
    }

    return(
        <div className="custom-modal" id="delete-account-modal" onClick={(e) => {e.stopPropagation();}}>
            <div className="custom-modal-header justify-content-center">
                <h5>Delete Account</h5>
            </div>
            <div className="custom-modal-body">
                <input type="text" className="input-field w-100" placeholder="Write your username here" data-category="input-field" onChange={(e) => {setInputtedUsername(e.target.value)}}/>
            </div>
            <div className="custom-modal-footer justify-content-center" style={{flexDirection: "column"}}>
                <button className="btn btn-danger w-100 rounded-15" onClick={deleteAccount}>Delete Account</button>
                <button className="btn btn-light mt-2 rounded-15" onClick={() => closeModal()}>Cancel</button>
            </div>
        </div>
    );
}