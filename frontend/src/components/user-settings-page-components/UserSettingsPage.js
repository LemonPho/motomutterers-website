import React, { useState, useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import ProfilePictureSettings from "./ProfilePictureSettings";
import UsernameSettings from "./UsernameSettings";
import EmailSettings from "./EmailSettings";
import PasswordSettings from "./PasswordSettings";

import { useApplicationContext } from "../ApplicationContext";
import DeleteAccount from "./DeleteAccount";

export default function UserSettings(){
    const {user, userLoading, setErrorMessage} = useApplicationContext();

    if(userLoading){
        return null;
    }

    if(!userLoading && !user.is_logged_in){
        setErrorMessage("You must be logged in to use this page");
        return null;
    }

    return(
        <div>
            <div className="card rounded-15 element-background-color element-border-color">
                <ProfilePictureSettings />
                <hr />
                <UsernameSettings />
                <hr />
                <EmailSettings />
                <hr />
                <PasswordSettings />
                <hr />
                <DeleteAccount />
                <hr />
            </div>
        </div>
    );
}