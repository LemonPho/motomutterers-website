import React, { useState } from "react";
import { useApplicationContext } from "../ApplicationContext";
import { submitDeleteAccount } from "../fetch-utils/fetchPost";
import { useNavigate } from "react-router-dom";

export default function DeleteAccount(){
    const { user, setErrorMessage, setSuccessMessage, retrieveUserData, contextLoading } = useApplicationContext();

    const [username, setUsername] = useState("");

    const navigate = useNavigate();

    async function deleteAccount(){
        if(username != user.username){
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
        retrieveUserData();
        closeModals();
        navigate("/");
    }

    function handleUsernameChange(event){
        setUsername(event.target.value);
    }

    if(contextLoading){
        return null;
    }

    return(
        <div>
            <div className="p-3 d-flex align-items-center">
                <strong style={{fontSize: "20px"}}>Delete Account</strong>
                <button className="ms-auto btn btn-outline-danger rounded-15" onClick={(e) => {toggleModal("delete-account-modal", e, user.is_logged_in);setUsername("")}}>Delete Account</button>
            </div>
            <div className="custom-modal" id="delete-account-modal" onClick={(e) => {e.stopPropagation();}}>
                <div className="custom-modal-header justify-content-center">
                    <h5>Delete Account</h5>
                </div>
                <div className="custom-modal-body">
                    <input type="text" className="input-field w-100" placeholder="Write your username here" data-category="input-field" onChange={(e) => {handleUsernameChange(e)}}/>
                </div>
                <div className="custom-modal-footer justify-content-center" style={{flexDirection: "column"}}>
                    <button className="btn btn-danger w-100 rounded-15" onClick={deleteAccount}>Delete Account</button>
                    <button className="btn btn-light mt-2 rounded-15" onClick={closeModals}>Cancel</button>
                </div>
            </div>
        </div>
        
    );
}