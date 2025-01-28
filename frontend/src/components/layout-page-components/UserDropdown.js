import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { submitLogout } from "../fetch-utils/fetchPost";

import { useApplicationContext } from "../ApplicationContext";
import { getLoggedIn, getUser } from "../fetch-utils/fetchGet";
import { toggleDropdown } from "../utils";
import ProfilePictureLazyLoader from "../util-components/ProfilePictureLazyLoader";

export default function UserDropdown(){
    const [errorOcurred, setErrorOcurred] = useState(false);

    const { user, userLoading, setLogout } = useApplicationContext();

    async function sendLogout(){
        const loggedOutResponse = await submitLogout();
        if(loggedOutResponse.error){
            setErrorOcurred(true);
        }
        setLogout();
    };

    if(userLoading){
        return null;
    }

    if(!user.is_logged_in){
        return(
            <div className="d-flex align-items-center">
                <a className="navbar-text link-no-decorations" href="/login">Login</a>
                <a className="navbar-text link-no-decorations ps-3" href="/register">Register</a>
            </div>
        )
    }

    return(

        <div className="dropdown-div">
            <div id="user-dropdown-button">
                <div className="ms-auto mt-2 mb-2" onClick={(e) => {toggleDropdown("user-dropdown-content", e, user.is_logged_in)}}>
                    <ProfilePictureLazyLoader width={"2rem"} height={"2rem"} username={user.username}/>
                </div>
            </div>
            <ul id="user-dropdown-content" className="dropdown-menu" style={{top: "100%", right: "0"}}>
                {errorOcurred && <div className="alert alert-danger m-2"><small className="dropdown-item">There was an error loading the user dropdown menu</small></div>}
                <li>
                    <a href={`/users/${user.username}?page=1`} className="d-flex align-items-center py-2 link-no-decorations">
                        <div className="ms-3">
                            <ProfilePictureLazyLoader width={"2rem"} height={"2rem"} username={user.username}/>
                        </div>
                        <div className="mx-2">{user.username}</div>
                    </a>
                </li>
                <hr className="mt-1 mb-1"/>
                <li><a className="dropdown-item" href={`/settings`}>User Settings</a></li>
                {user.is_admin === true && <li><a className="dropdown-item" href={`/administration`}>Fantasy League Administration</a></li>}
                {user.is_admin === true && <li><a className="dropdown-item" href={`/admin/`}>Site Administration</a></li>}
                <li><a className="dropdown-item link-button" onClick={sendLogout}>Logout</a></li>
            </ul>
        </div>
    );
    
}