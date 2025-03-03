import React, { useState, useEffect, useContext } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";

import { submitLogin } from "./fetch-utils/fetchPost";
import { useApplicationContext } from "./ApplicationContext";
import { enterKeySubmit } from "./utils";

function LoginPage() {
    const { user, userLoading, contextLoading, setLoadingMessage, retrieveUserData, setErrorMessage} = useApplicationContext();

    const [loginLoading, setLoginLoading] = useState(false);

    const [primaryKeyInput, setPrimaryKeyInput] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function login(){
        if(loginLoading){
            return;
        }

        setLoginLoading(true);
        setLoadingMessage("Loading...");

        let isUsername = true;

        if(primaryKeyInput.includes("@")){
            isUsername = false
        }

        const loginResponse = await submitLogin(isUsername, primaryKeyInput, password);

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
            setErrorMessage("Your account is not active");
            return;
        }

        if(loginResponse.status === 200){
            retrieveUserData();
            setLoadingMessage(false);
            setLoginLoading(false);
            navigate("/");
            return;
        }        
    }

    if(contextLoading){
        return null;
    }

    return(
        <div className="card rounded-15 element-background-color element-border-color mx-auto" style={{width: "21rem"}}>
            <div className="card-header d-flex justify-content-center rounded-15 nested-element-color m-2">
                <h2>Login</h2>
            </div>
            <div className="card-body rounded-15 nested-element-color m-2">
                <input type="text" className="input-field w-100 mb-2" placeholder="Username or email" onKeyUp={(e) => {setPrimaryKeyInput(e.target.value);enterKeySubmit(e, login)}}/>
                <input type="password" className="input-field w-100 mb-2" placeholder="Password" onKeyUp={(e) => {setPassword(e.target.value);enterKeySubmit(e, login)}}/>
                {loginLoading && 
                <div className="input-group mx-auto">
                    <button type="submit" className="btn btn-primary w-100 rounded-15" disabled>Loading...</button>
                </div>}
                {!loginLoading && 
                <div className="input-group mx-auto">
                    <button type="submit" className="btn btn-primary w-100 rounded-15" onClick={login}>Login</button>
                </div>}
                <div className="container d-flex justify-content-center">
                    <small className="mt-2 px-3"><Link to="/find-account">Forgot your password?</Link></small>
                </div>
                <hr />
                <Link to="/register" className="btn btn-success w-100 rounded-15">Create account</Link>
            </div>
        </div>
    );
}

export default LoginPage;