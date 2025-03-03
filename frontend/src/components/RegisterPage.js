import React, { useState, useEffect, useContext } from "react";
import { Navigate, Link } from "react-router-dom";

import { submitRegistration } from "./fetch-utils/fetchPost";

import { useApplicationContext } from "./ApplicationContext";

import { enterKeySubmit } from "./utils";

export default function RegisterPage() {
    const {loggedIn, contextLoading, setErrorMessage, setSuccessMessage, setLoadingMessage, resetApplicationMessages} = useApplicationContext();

    const [loading, setLoading] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    async function registerAccount(){
        if(loading){
            return;
        }

        resetApplicationMessages();
        setLoading(true);
        setLoadingMessage("Loading...");

        const registerResponse = await submitRegistration(username, email, password, passwordConfirmation);

        if(registerResponse.error){
            setErrorMessage("An error ocurred while submiting the account");
            setLoading(false);
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
            if(registerResponse.usernameUnique && registerResponse.usernameValid && registerResponse.emailUnique && registerResponse.emailValid && registerResponse.passwordValid && registerResponse.passwordsMatch && registerResponse.invalidData){
                setErrorMessage("Be sure the data is valid (password can not be simple and more than 8 characters)");
            }
            setErrorMessage(message);
            setLoading(false);
            setLoadingMessage(false);
            return;
        }

        if(registerResponse.status === 200){
            setSuccessMessage("Account created, check your email to finalize the creation")
            setLoading(false);
            setLoadingMessage(false);
            return;
        }

        setErrorMessage("There was an error while submiting the account information");
        setLoading(false);
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

    return(
        <div className="card rounded-15 element-background-color element-border-color mx-auto" style={{width: "21rem"}}>
            <div className="card-header d-flex justify-content-center rounded-15 nested-element-color m-2">
                <h2>Sign Up</h2>
            </div>
            <div className="card-body rounded-15 nested-element-color m-2">
                <input type="text" className="input-field w-100 mb-2" placeholder="Username" onKeyUp={(e) => {setUsername(e.target.value);enterKeySubmit(e, registerAccount)}}/>
                <input type="text" className="input-field w-100 mb-2" placeholder="Email" onKeyUp={(e) => {setEmail(e.target.value);enterKeySubmit(e, registerAccount)}}/>
                <input type="text" className="input-field w-100 mb-2" placeholder="Password" onKeyUp={(e) => {setPassword(e.target.value);enterKeySubmit(e, registerAccount)}}/>
                <input type="text" className="input-field w-100 mb-2" placeholder="Confirm password" onKeyUp={(e) => {setPasswordConfirmation(e.target.value);enterKeySubmit(e, registerAccount)}}/>

                {loading && <button className="btn btn-primary w-100 rounded-15 mt-2" disabled>Loading...</button>}
                {!loading && <button className="btn btn-primary w-100 rounded-15 mt-2" onClick={registerAccount}>Sign up</button>}
                <hr />
                <Link to="/login" className="btn btn-success w-100 rounded-15">Login to an account</Link>
            </div>
        </div>
    );
}