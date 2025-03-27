import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { sendNewPasswordEmail } from "./fetch-utils/fetchPost";
import { useApplicationContext } from "./ApplicationContext";
import { enterKeySubmit } from "./utils";
import TextInput from "./util-components/TextInput";

export default function FindAccount() {
    const [loading, setLoading] = useState(null);
    const [account, setAccount] = useState(null);
    const [accountFound, setAccountFound] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [searchInvalid, setSearchInvalid] = useState(false);

    const { setErrorMessage, setSuccessMessage } = useApplicationContext();

    async function searchAccount(){
        setSearchInvalid(false);
        try{            
            let queryString = "/api/find-account?";

            if(searchInput.includes("@")){
                queryString += `email=${searchInput}`;
            } else {
                queryString += `username=${searchInput}`;
            }

            const searchResponse = await fetch(queryString);
            if(searchResponse.ok){
                const response = await searchResponse.json();
                setAccount(response);
                setAccountFound(true);
                setSuccessMessage("Account found");
            } else {
                setAccountFound(false);
                setErrorMessage(`There was no accout found for: ${searchInput}`);
                setSearchInvalid(true);
                setAccount(null);
            }
        } catch(error){
            console.log(error);
        }
    }

    async function sendEmail(){
        if(!accountFound) return;

        setLoading(true);
        let emailResponse = await sendNewPasswordEmail(searchInput);

        if(emailResponse.error){
            return;
        }

        if(emailResponse.status === 200){
            setSuccessMessage("Email sent");
        } else {
            setErrorMessage("There was an error sending the email");
        }

        setLoading(false);
    }

    return(
        <div className="card element-background-color element-border-color rounded-15 mx-auto" style={{width: "21rem"}}>
            <div className="card-header d-flex justify-content-center rounded-15 nested-element-color m-2">
                <h2>Search Account</h2>
            </div>
            <div className="card-body rounded-15 nested-element-color m-2">
                <TextInput type="text" placeholder="Write your email or username" value={searchInput} setValue={setSearchInput} onEnterFunction={searchAccount} outline={searchInvalid}/>
                <div className="mt-3">
                    {(accountFound == true && !loading) && <button className="btn btn-success rounded-15 w-100 mb-2" onClick={sendEmail}>Send reset password email</button>}
                    {(accountFound && loading) && <button className="btn btn-success rounded-15 w-100 mb-2" disabled>Sending email...</button>}
                    <button className="btn btn-primary rounded-15 w-100" onClick={searchAccount}>Search</button>
                </div>
            </div>
            <div className="card-footer d-flex justify-content-center nested-element-color m-2 rounded-15">
                <Link to="/contact"><small>Contact admin</small></Link>
            </div>
        </div>
    );
}

