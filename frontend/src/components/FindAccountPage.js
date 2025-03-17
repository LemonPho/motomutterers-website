import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { sendNewPasswordEmail } from "./fetch-utils/fetchPost";
import { useApplicationContext } from "./ApplicationContext";
import { enterKeySubmit } from "./utils";

export default function FindAccount() {
    const [loading, setLoading] = useState(null);
    const [account, setAccount] = useState(null);
    const [accountFound, setAccountFound] = useState(null);
    const [searchInput, setSearchInput] = useState("");

    const { setErrorMessage, setSuccessMessage } = useApplicationContext();

    async function searchAccount(){
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
            console.log(emailResponse.error);
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
            <div className="card-header d-flex justify-content-center">
                <h2>Search Account</h2>
            </div>
            <div className="card-body">
                <input type="text" className="input-field w-100" placeholder="Write your email or password" onKeyUp={(e) => {setSearchInput(e.target.value); enterKeySubmit(e, searchAccount)}}/>
                <div className="mt-3">
                    {(accountFound == true && !loading) && <button className="btn btn-success rounded-15 w-100 mb-2" onClick={sendEmail}>Send reset password email</button>}
                    {(accountFound && loading) && <button className="btn btn-success rounded-15 w-100 mb-2" disabled>Sending email...</button>}
                    <button className="btn btn-primary rounded-15 w-100" onClick={searchAccount}>Search</button>
                </div>
            </div>
            <div className="card-footer d-flex justify-content-center">
                <Link to="/contact"><small>Contact admin</small></Link>
            </div>
        </div>
    );
}

