import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

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
                <Link className="navbar-text link-no-decorations" to="/login">Login</Link>
                <Link className="navbar-text link-no-decorations ps-3" to="/register">Register</Link>
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
                    <Link to={`/users/${user.username}?page=1`} className="d-flex align-items-center py-2 link-no-decorations">
                        <div className="ms-3">
                            <ProfilePictureLazyLoader width={"2rem"} height={"2rem"} username={user.username}/>
                        </div>
                        <div className="mx-2">{user.username}</div>
                    </Link>
                </li>
                <hr className="mt-1 mb-1"/>
                <li><Link className="dropdown-item" to={`/settings`}>User Settings</Link></li>
                {user.is_admin === true && <li><Link className="dropdown-item" to={`/administration`}>Fantasy League Administration</Link></li>}
                {user.is_admin === true && <li><Link className="dropdown-item" to={`/admin/`}>Site Administration</Link></li>}
                <li><a className="dropdown-item link-button" onClick={sendLogout}>Logout</a></li>
            </ul>
        </div>
    );
    
}