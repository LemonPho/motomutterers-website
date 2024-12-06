import React, { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";

import { submitRegistration } from "./fetch-utils/fetchPost";

import ApplicationContext, { useApplicationContext } from "./ApplicationContext";

import { enterKeySubmit } from "./utils";

function RegisterPage() {
    const {loggedIn, contextLoading, setErrorMessage, setSuccessMessage, setLoadingMessage} = useApplicationContext();

    const [createUserLoading, setCreateUserLoading] = useState(false);

    async function registerAccount(){
        setLoadingMessage("Loading...");
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password1 = document.getElementById("password").value;
        const password2 = document.getElementById("password-confirm").value;

        const registerResponse = await submitRegistration(username, email, password1, password2);

        console.log(registerResponse);

        if(registerResponse.error){
            setErrorMessage("An error ocurred while submiting the account");
            setCreateUserLoading(false);
            setLoadingMessage(false)
            return;
        }

        if(registerResponse.status === 400){
            let message = registerResponse.usernameUnique ? "" : "Username is already taken\n";
            message += registerResponse.usernameValid ? "" : "Username isn't valid, be sure to use only numbers and letters\n";
            message += registerResponse.emailUnique ? "" : "Email is already in use\n";
            message += registerResponse.emailValid ? "" : "Email isn't valid\n";
            message += registerResponse.passwordsMatch ? "" : "Passwords don't match\n";
            message += registerResponse.passwordValid ? "" : "Passwords need at least 8 characters and can't be 'simple'\n";
            setErrorMessage(message);
            setCreateUserLoading(false);
            setLoadingMessage(false);
            return;
        }

        if(registerResponse.status === 200){
            setSuccessMessage("Account created, check your email to finalize the creation")
            setCreateUserLoading(false);
            setLoadingMessage(false);
            return;
        }

        setErrorMessage("There was an error while submiting the account information");
        setCreateUserLoading(false);
        setLoadingMessage(false);
        return;
    }

    if(contextLoading){
        return null;
    }

    if(loggedIn){
        return(
            <div>
                <Navigate replace to="/"/>
            </div>
        )
    }

    return (
        <div> 
            <div className="card shadow mx-auto my-5 rounded-15" style={{width: "21rem"}}>
                <div className="my-3" style={{display: "flex"}}> 
                    <h6 style={{margin: "auto", fontSize: "40px"}}>Sign up</h6>
                </div>
                <hr className="mt-2"/>
                <div className="input-group mt-3 px-3 mx-auto">
                {createUserLoading && <div className="alert alert-secondary w-100"><div className="d-flex justify-content-center">Loading...</div></div>}
                </div>
                <div className="input-group px-3  mx-auto">
                    <input type="text" className="form-control" placeholder="Username" id="username" onKeyUp={(e) => enterKeySubmit(e, registerAccount)}/>
                </div>
                <div className="input-group mt-3 px-3  mx-auto">
                    <input type="text" className="form-control" placeholder="Email" id="email" onKeyUp={(e) => enterKeySubmit(e, registerAccount)}/>
                </div>
                <div className="input-group mt-3 px-3  mx-auto">
                    <input type="password" className="form-control" placeholder="Password" id="password" onKeyUp={(e) => enterKeySubmit(e, registerAccount)}/>
                </div>
                <div className="input-group mt-3 px-3 mx-auto">
                    <input type="password" className="form-control" placeholder="Confirm password" id="password-confirm" onKeyUp={(e) => enterKeySubmit(e, registerAccount)}/>
                </div>
                <div className="input-group mt-3 px-3 mx-auto">
                    <button className="btn btn-primary w-100" onClick={registerAccount}>Sign up</button>
                </div>
                <hr />
                <div className="input-group mb-3 px-3 mx-auto">
                    <a href="/login" className="btn btn-success w-100">Login to an account</a>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;