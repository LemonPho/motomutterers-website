import React, { useState, useContext, useEffect } from "react";

import { useApplicationContext } from "../ApplicationContext";
import Modal from "../util-components/Modal";
import DeleteAccountModal from "./DeleteAccountModal";
import { useOpenersContext } from "../OpenersContext";
import UsernameChangeModal from "./UsernameChangeModal";
import ProfilePictureChangeModal from "./ProfilePictureChangeModal";
import PasswordChangeModal from "./PasswordChangeModal";
import EmailChangeModal from "./EmailChangeModal";
import ProfilePictureLazyLoader from "../util-components/ProfilePictureLazyLoader";

export default function UserSettings(){
    const {user, userLoading, setErrorMessage, retrieveUserData, resetApplicationMessages} = useApplicationContext();
    const { openedModal, openModal, closeModal } = useOpenersContext();

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