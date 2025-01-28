import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import PageNotFound from "../PageNotFound";
import { useAnnouncementContext } from "./AnnouncementContext";
import { useApplicationContext } from "../ApplicationContext";
import { toggleDropdown } from "../utils";
import ProfilePictureLazyLoader from "../util-components/ProfilePictureLazyLoader";

export default function AnnouncementContent(){
    const { user, contextLoading } = useApplicationContext();
    const { announcement, editAnnouncement, retrieveAnnouncement, deleteAnnouncement } = useAnnouncementContext();

    const [announcementEditLoading, setAnnouncementEditLoading] = useState(false);

    function toggleEditAnnouncement(){
        const title = document.getElementById("announcement-title");
        const text = document.getElementById("announcement-text");
        const saveButton = document.getElementById("save-edit-announcement");
        const cancelButton = document.getElementById("cancel-edit-announcement");

        title.contentEditable = title.contentEditable === "false";
        text.contentEditable = text.contentEditable === "false";
        text.classList.toggle("input-field");
        title.classList.toggle("input-field");
        saveButton.classList.toggle("hidden");
        cancelButton.classList.toggle("hidden");
    }

    function cancelEditAnnouncement(){
        toggleEditAnnouncement();
        retrieveAnnouncement();
        const title = document.getElementById("announcement-title");
        const text = document.getElementById("announcement-text");
        title.innerHTML = announcement.title;
        text.innerHTML = announcement.text;
    }

    function saveEditAnnouncement(){
        setAnnouncementEditLoading(true);
        const title = document.getElementById("announcement-title").innerHTML;
        const text = document.getElementById("announcement-text").innerHTML;

        editAnnouncement(title, text, announcement.id);
        setAnnouncementEditLoading(false);
    }

    function saveDeleteAnnouncement(){
        setAnnouncementEditLoading(true);
        deleteAnnouncement(announcement.id);
        setAnnouncementEditLoading(false);
    }

    if(contextLoading){
        return null;
    }

    return(
        <div>
            { announcementEditLoading && <div className="alert alert-secondary">Loading...</div>}
            <div className="card rounded-15 element-background-color element-border-color" id="announcement-card">
                <div className="card-header d-flex align-items-center p-3">
                    <h3 id="announcement-title" className="" contentEditable={false}>{announcement.title}</h3>
                    <span className="ms-2 me-2">•</span>
                    <a href={`/users/${announcement.user.username}?page=1`} className="link-no-decorations">
                        <ProfilePictureLazyLoader width={"2.75rem"} height={"2.75rem"} username={announcement.user.username}/>
                        <span className="ms-2"><strong>{announcement.user.username}</strong></span>
                    </a>
                    { 
                    user.is_admin && 
                        <div className="ms-auto dropdown-div">
                            <button id="announcement-dropdown-button" className="btn btn-link link-no-decorations ms-auto" onClick={(e) => toggleDropdown("dropdown-announcement", e)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                </svg>
                            </button>
                            <div id={`dropdown-announcement`} className="dropdown-menu">
                                <li><button className="dropdown-item" onClick={toggleEditAnnouncement}>Edit</button></li>
                                <li><a className="dropdown-item" onClick={saveDeleteAnnouncement}>Delete</a></li>
                            </div>
                        </div>
                    }
                </div>  
                <div className="break-line-text card-body">
                    <div id="announcement-text" className="" contentEditable={false}>{announcement.text}</div>
                </div>
                <div className="d-flex mt-1">
                    <button id="save-edit-announcement" className="btn btn-primary hidden m-2 rounded-15" onClick={saveEditAnnouncement}>Save</button>
                    <button id="cancel-edit-announcement" className="me-auto btn btn-secondary hidden m-2 rounded-15" onClick={cancelEditAnnouncement}>Cancel</button>
                </div>
            </div>
        </div>
    );
    
}