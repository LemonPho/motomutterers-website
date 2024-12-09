import React, { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";

import { submitLogin } from "./fetch-utils/fetchPost";
import { useApplicationContext } from "./ApplicationContext";
import { enterKeySubmit } from "./utils";

function LoginPage() {
    const {loggedIn, contextLoading, setLoadingMessage, retrieveUserData, setErrorMessage} = useApplicationContext();

    const [loginLoading, setLoginLoading] = useState(false);

    async function login(){
        if(loginLoading){
            return;
        }

        setLoginLoading(true);
        setLoadingMessage("Loading...");

        let isUsername = true;
        let usernameEmail = document.getElementById("username-email").value;
        let password = document.getElementById("password").value;

        if(usernameEmail.includes("@")){
            isUsername = false
        }

        const loginResponse = await submitLogin(isUsername, usernameEmail, password);

        setLoadingMessage(false);
        setLoginLoading(false);

        if(loginResponse.error){
            setErrorMessage("Error logging in");
            console.log(loginResponse.error);
            return;
        }

        if(loginResponse.status == 400){
            setErrorMessage("Invalid credentials");
            return;
        }

        if(loginResponse.status === 403){
            setErrorMessage("Your account isn't activated, check your spam to make sure it isn't there. If the link expired, you can still open it and request a new activation email.");
            return;
        }

        if(loginResponse.status === 200){
            retrieveUserData();
        }

        setLoadingMessage(false);
        setLoginLoading(false);
    }

    if(contextLoading){
        return null;
    }

    if(loggedIn){
        return(<Navigate to="/" replace={true}/>);
    }

    return (
        <div>
            <div className="card shadow mx-auto my-5 rounded-15" style={{width: "21rem"}}>
                <div className="my-3" style={{display: "flex"}}> 
                    <h6 style={{margin: "auto", fontSize: "40px"}}>Login</h6>
                </div>
                <hr className="mt-2"/>
                <div className="input-group px-3 mx-auto">
                    <input type="text" className="form-control" placeholder="Username or email" id="username-email" onKeyUp={(e) => {enterKeySubmit(e, login)}}/>
                </div>
                <div className="input-group mt-3 px-3 mx-auto">
                    <input type="password" className="form-control" placeholder="Password" id="password" onKeyUp={(e) => {enterKeySubmit(e, login)}}/>
                </div>
                
                {loginLoading && 
                <div className="input-group mt-3 px-3 mx-auto">
                    <button type="submit" className="btn btn-primary w-100" disabled>Loading...</button>
                </div>}
                {!loginLoading && 
                <div className="input-group mt-3 px-3 mx-auto">
                    <button type="submit" className="btn btn-primary w-100" onClick={login}>Login</button>
                </div>}
                
                <div className="container d-flex justify-content-center">
                    <small className="mt-2 px-3"><a href="/find-account">Forgot your password?</a></small>
                </div>
                <hr className="mt-2"/>
                <div className="input-group mb-3 px-3 mx-auto">
                    <a href="/register" className="btn btn-success w-100">Create account</a>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;