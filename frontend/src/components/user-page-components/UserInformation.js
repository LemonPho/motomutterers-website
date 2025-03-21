import React, { useEffect, useState } from "react";
import { getUser } from "../fetch-utils/fetchGet";
import { Link } from "react-router-dom";
import ProfilePictureLazyLoader from "../util-components/ProfilePictureLazyLoader";
import { useApplicationContext } from "../ApplicationContext";

export default function UserInformation({ username }){
    const {setErrorMessage, user, userLoading} = useApplicationContext();

    const [loading, setLoading] = useState(true);
    const [displayUser, setDisplayUser] = useState({});
    

    async function retrieveDisplayUser(){
        if(username == null){
            setErrorMessage("Invalid link");
            return;
        }

        setLoading(true);
        const userResponse = await getUser(username);
        setLoading(false);

        if(userResponse.status === 404){
            setErrorMessage("User not found");
            return;
        }

        if(userResponse.error){
            setErrorMessage("There was an error while loading the user data");
            return;
        }

        setDisplayUser(userResponse.user);
    } 

    useEffect(() => {
        async function fetchData(){
            await retrieveDisplayUser();
        }

        fetchData();
    }, [username]);

    return (
        <div className="col-md-4">
            <div id="user-view" className="card rounded-15 p-3 element-background-color element-border-color">
                <div className="rounded-15 nested-element-color p-1">
                    <div className="d-flex align-items-center justify-content-center">
                        <ProfilePictureLazyLoader width={"7rem"} height={"7rem"} username={username}/>
                    </div>
                    <div className="d-flex justify-content-center w-100">
                        {!loading && <div className="username-text">{displayUser.username}</div>}
                    </div>
                    {(!loading && !userLoading && displayUser.username == user.username) && 
                    <div className="d-flex justify-content-center align-items-center link-no-decorations">
                        <Link className="link-no-decorations" to={`/settings`}>
                            <span>Edit</span>
                            <svg style={{marginLeft: "0.15rem"}} xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none">
                                <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </Link>
                    </div>}
                </div>
                
                <hr />
                <div className="rounded-15 nested-element-color p-2">
                    <h5>Account created on</h5>
                    {!loading && <span>{new Date(displayUser.date_created).toISOString().substring(0,10)}</span>}
                </div>
            </div>
        </div>
    );
}