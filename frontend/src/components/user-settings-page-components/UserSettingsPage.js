import React, { useState, useContext, useEffect, useRef } from "react";

import { useApplicationContext } from "../ApplicationContext";
import Modal from "../util-components/Modal";
import DeleteAccountModal from "./DeleteAccountModal";
import { useOpenersContext } from "../OpenersContext";
import UsernameChangeModal from "./UsernameChangeModal";
import ProfilePictureChangeModal from "./ProfilePictureChangeModal";
import PasswordChangeModal from "./PasswordChangeModal";
import EmailChangeModal from "./EmailChangeModal";
import ProfilePictureLazyLoader from "../util-components/ProfilePictureLazyLoader";
import Expand from "../util-components/Expand";
import EmailNotificationsSettings from "./EmailNotificationsSettings";

export default function UserSettings(){
    
    const {user, userLoading, setErrorMessage, retrieveUserData, resetApplicationMessages} = useApplicationContext();
    const { openedModal, openModal, closeModal } = useOpenersContext();

    const [ emailSettingsExpanded, setEmailSettingsExpanded ] = useState(false);

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
                <div className="p-3 d-flex justify-content-center nested-element-color rounded-15 m-2">
                    <div>
                        <div>
                            <strong style={{fontSize: "20px"}}>Profile photo</strong>
                        </div>
                        <div>
                            <ProfilePictureLazyLoader width={"7rem"} height={"7rem"} username={user.username}/>
                        </div>
                    </div>
                    <button id="profile-picture-button" className="btn btn-outline-secondary rounded-15 align-self-center ms-auto" onClick={(e) => {resetApplicationMessages();openModal("profile-picture-change")}}>Change</button>          
                    <Modal isOpen={openedModal == "profile-picture-change"}>
                        <ProfilePictureChangeModal closeModal={closeModal} retrieveUserData={retrieveUserData}/>
                    </Modal>
                </div>
                <div className="p-3 d-flex justify-content-center nested-element-color rounded-15 m-2">
                    <div>
                        <strong style={{fontSize: "20px"}}>Username</strong>
                        <div>
                            <span className="ms-auto">{user.username}</span>
                        </div>
                    </div>
                    <button id="username-button" className="btn btn-outline-secondary rounded-15 align-self-center ms-auto" onClick={(e) => {resetApplicationMessages();openModal("username-change")}}>Change</button>
                    <Modal isOpen={openedModal == "username-change"}>
                        <UsernameChangeModal closeModal={closeModal} retrieveUserData={retrieveUserData}/>
                    </Modal>
                </div>
                
                <div className="p-3 d-flex justify-content-center nested-element-color rounded-15 m-2">
                    <div>
                        <strong style={{fontSize: "20px"}}>Email</strong>
                        <div>{user.email}</div>
                    </div>
                    <button id="email-button" className="btn btn-outline-secondary rounded-15 align-self-center ms-auto" onClick={(e) => {resetApplicationMessages();openModal("email-change");}}>Change</button>
                    <Modal isOpen={openedModal == "email-change"}>
                        <EmailChangeModal closeModal={closeModal} retrieveUserData={retrieveUserData} />
                    </Modal>
                </div>
                <div className="p-3 d-flex justify-content-center nested-element-color rounded-15 m-2">
                    <div>
                        <strong style={{fontSize: "20px"}}>Password</strong>
                        <div>••••••••••</div>
                    </div>
                    <button id="password-button" className="btn btn-outline-secondary rounded-15 align-self-center ms-auto" onClick={(e) => {resetApplicationMessages();openModal("password-change")}}>Change</button>
                    <Modal isOpen={openedModal == "password-change"}>
                        <PasswordChangeModal closeModal={closeModal}/>
                    </Modal>
                </div>

                <div>
                    <div className="nested-element-color rounded-15 m-2">
                        <div className="p-3 rounded-15 d-flex align-items-center clickable" onClick={() => setEmailSettingsExpanded(!emailSettingsExpanded)}>
                            <strong style={{"fontSize": "20px"}}>Email Settings</strong>
                            <button className="ms-auto btn btn-light">
                                {emailSettingsExpanded && 
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-up" viewBox="0 0 16 16">
                                    <path d="M3.204 11h9.592L8 5.519zm-.753-.659 4.796-5.48a1 1 0 0 1 1.506 0l4.796 5.48c.566.647.106 1.659-.753 1.659H3.204a1 1 0 0 1-.753-1.659"/>
                                </svg>
                                }

                                {!emailSettingsExpanded && 
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down" viewBox="0 0 16 16">
                                    <path d="M3.204 5h9.592L8 10.481zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659"/>
                                </svg>
                                }
                            </button>
                        </div>
                        
                        <Expand expanded={emailSettingsExpanded} id={"email-settings"}>
                            <EmailNotificationsSettings />
                        </Expand>
                    </div>
                </div>

                <div>
                    <div className="p-3 d-flex align-items-center nested-element-color rounded-15 m-2">
                        <strong style={{fontSize: "20px"}}>Delete Account</strong>
                        <button className="ms-auto btn btn-outline-danger rounded-15" onClick={(e) => {resetApplicationMessages();openModal("account-delete")}}>Delete Account</button>
                    </div>
                    <Modal isOpen={openedModal == "account-delete"}>
                        <DeleteAccountModal closeModal={closeModal} retrieveUserData={retrieveUserData}/>
                    </Modal>
                </div>
                <hr />
            </div>
        </div>
    );
}