import React, { useState, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";

import ProfilePictureSettings from "./ProfilePictureSettings";
import UsernameSettings from "./UsernameSettings";
import EmailSettings from "./EmailSettings";
import PasswordSettings from "./PasswordSettings";

import { useApplicationContext } from "../ApplicationContext";

export default function UserSettings(){
    const {loggedIn, contextLoading} = useApplicationContext();

    if(contextLoading){
        return null;
    }

    if(!loggedIn){
        return(
            <div>
                <Navigate replace to="/login"/>
            </div>
        );
    }

    return(
        <div>
            <div className="card rounded-15 my-3 element-background-color element-border-color">
                <ProfilePictureSettings />
                <hr />
                <UsernameSettings />
                <hr />
                <EmailSettings />
                <hr />
                <PasswordSettings />
            </div>
        </div>
    );
}