import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { sendNewPasswordEmail } from "./fetch-utils/fetchPost";

//oh man this looks really not well done, it works so i will leave it
export default function FindAccount() {
    const [errorOcurred, setErrorOcurred] = useState(null);

    const [accountFound, setAccountFound] = useState(null);
    const [accountUsername, setAccountUsername] = useState(null);
    const [emailSendSuccess, setEmailSendSuccess] = useState(null);
    const [emailLoading, setEmailLoading] = useState(null);

    async function searchAccount(){
        try{            
            let usernameOrEmail = document.getElementById("username-email").value;
            let queryString = "/api/find-account?";

            if(usernameOrEmail.includes("@")){
                queryString += `email=${usernameOrEmail}`;
            } else {
                queryString += `username=${usernameOrEmail}`;
            }

            const searchResponse = await fetch(queryString);
            if(searchResponse.ok){
                const response = await searchResponse.json();
                setAccountUsername(response.username);
                setAccountFound(true);
            } else {
                setAccountFound(false);
            }
        } catch(error){
            console.log(error);
            setErrorOcurred(true);
        }
    }

    async function sendEmail(){
        setEmailLoading(true);
        let emailResponse = await sendNewPasswordEmail(accountUsername);

        if(emailResponse.error){
            setErrorOcurred(true);
            console.log(emailResponse.error);
            setEmailLoading(false);
            return;
        }

        if(emailResponse.status === 200){
            setEmailSendSuccess(true);
        } else {
            setEmailSendSuccess(false);
        }

        setEmailLoading(false);
    }

    function resetPage(){
        setAccountFound(null);
        setAccountUsername(null);
    }

    if(accountFound === true){
        return(
            <div>
                <div className="card shadow mx-auto my-5 rounded-15" style={{width: "30rem"}}>
                    <div className="my-3" style={{display: "flex"}}>
                        <h6 style={{margin: "auto", fontSize: "40px"}}>Account Found</h6>
                    </div>
                    <hr className="mt-2"/>
                    <div className="mt-3 px-3">
                        {emailLoading && <div className="alert alert-secondary d-flex justify-content-center"><small>Sending email...</small></div>}
                        {emailSendSuccess === true && <div className="alert alert-success"><small>Email sent successfully, please follow the instructions in the email</small></div>}
                        {errorOcurred === true && <div className="alert alert-danger"><small>Error occured, please contact admin or try again</small></div>}
                    </div>
                    <div className="px-3">
                        <span>This account was found: {accountUsername}</span>
                        <br/>
                        <span>We can send an email to reset the password</span>
                    </div>
                    <div className="mt-3 px-3">
                        <button className="btn btn-primary float-left" style={{width: "48%"}} onClick={resetPage}>Search again</button>
                        <button className="btn btn-primary ms-3" style={{width: "48%"}} onClick={sendEmail}>Send email</button>
                    </div>
                    <div className="container d-flex justify-content-center mt-2 mb-2 px-3">
                        <Link to="/contact"><small>Contact admin</small></Link>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <div className="card shadow mx-auto my-5 rounded-15" style={{width: "30rem"}}>
                    <div className="my-3" style={{display: "flex"}}>
                        <h6 style={{margin: "auto", fontSize: "40px"}}>Find my Account</h6>
                    </div>
                    <hr className="mt-2"/>
                    <div className="mt-3 px-3">
                        {accountFound === false && <div className="alert alert-danger">Account not found, please try again</div>}
                    </div>
                    <div className="input-group px-3  mx-auto">
                        <input type="text" className="form-control" placeholder="Username or email" id="username-email"/>
                    </div>
                    <div className="input-group mt-3 px-3 mx-auto">
                        <button className="btn btn-primary btn-block" onClick={searchAccount}>Find Account</button>
                    </div>
                </div>
            </div>
        )
    }

    
}

