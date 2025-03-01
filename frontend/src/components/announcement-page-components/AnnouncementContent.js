import React, { useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import PageNotFound from "../PageNotFound";
import { useAnnouncementContext } from "./AnnouncementContext";
import { useApplicationContext } from "../ApplicationContext";
import { autoResizeTextarea } from "../utils";
import ProfilePictureLazyLoader from "../util-components/ProfilePictureLazyLoader";
import Dropdown from "../util-components/Dropdown";
import { useOpenersContext } from "../OpenersContext";

export default function AnnouncementContent(){
    const { user, contextLoading } = useApplicationContext();
    const { announcement, editAnnouncement, retrieveAnnouncement, deleteAnnouncement, announcementLoading } = useAnnouncementContext();
    const { openedDropdown, toggleDropdown, closeDropdown } = useOpenersContext();

    const [announcementEditLoading, setAnnouncementEditLoading] = useState(false);
    const [announcementDeleted, setAnnouncementDeleted] = useState(false);

    const editDiv = useRef(null);
    const staticDiv = useRef(null);
    const titleInput = useRef(null);
    const textInput = useRef(null);

    const [text, setText] = useState("");
    const [title, setTitle] = useState("");

    function toggleEditAnnouncement(){
        editDiv.current.classList.toggle("hidden");
        titleInput.current.defaultValue = announcement.title;
        textInput.current.defaultValue = announcement.text;
        setText(announcement.text);
        setTitle(announcement.title);
        staticDiv.current.classList.toggle("hidden");
        closeDropdown();
    }

    function cancelEditAnnouncement(){
        toggleEditAnnouncement();
    }

    async function saveEditAnnouncement(){
        setAnnouncementEditLoading(true);
        if(await editAnnouncement(title, text, announcement.id)){
            await retrieveAnnouncement();
            toggleEditAnnouncement();
        }
        setAnnouncementEditLoading(false);
        closeDropdown();
    }

    function saveDeleteAnnouncement(){
        setAnnouncementEditLoading(true);
        if(deleteAnnouncement(announcement.id)){
            setAnnouncementDeleted(true);
        }
        setAnnouncementEditLoading(false);
        closeDropdown();
    }

    if(contextLoading){
        return null;
    }

    if(announcementDeleted){
        return <Navigate to={`/announcements?page=1`} replace={true}/>
    }

    return(
        <div>
            { announcementEditLoading && <div className="alert alert-secondary">Loading...</div>}
            <div className="card rounded-15 element-background-color element-border-color" id="announcement-card">
                <div ref={staticDiv} id="static-div" className="">
                    <div className="card-header d-flex align-items-center p-3">
                        <h3 id="announcement-title" className="">{announcement.title}</h3>
                        <span className="ms-2 me-2">•</span>
                        <Link to={`/users/${announcement.user.username}?page=1`} className="link-no-decorations">
                            <ProfilePictureLazyLoader width={"2.75rem"} height={"2.75rem"} username={announcement.user.username}/>
                            <span className="ms-2"><strong>{announcement.user.username}</strong></span>
                        </Link>
                        { 
                        user.is_admin && 
                            <div className="ms-auto dropdown-div">
                                <button id="announcement-dropdown-button" className="btn btn-link link-no-decorations ms-auto" onClick={(e) => toggleDropdown("dropdown-announcement", e)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                    </svg>
                                </button>
                                <Dropdown isOpen={openedDropdown == "dropdown-announcement"}>
                                    <div id={`dropdown-announcement`} className="dropdown-menu">
                                        <li><button className="dropdown-item" onClick={toggleEditAnnouncement}>Edit</button></li>
                                        <li><a className="dropdown-item" onClick={saveDeleteAnnouncement}>Delete</a></li>
                                    </div>
                                </Dropdown>
                            </div>
                        }
                    </div>  
                    <div className="break-line-text card-body">
                        <div id="announcement-text" className="">{announcement.text}</div>
                    </div>
                </div>

                <div ref={editDiv} id="edit-div" className="hidden">
                    <div className="card-header d-flex align-items-center p-3">
                        <textarea ref={titleInput} rows={1} id="announcement-title-input" className="input-field textarea-expand w-100" defaultValue={announcement.title} onChange={(e) => {autoResizeTextarea(e.target); setTitle(e.target.value)}}></textarea>
                    </div>

                    <div className="card-body">
                        <textarea ref={textInput} rows={1} id="announcement-text-input" className="input-field textarea-expand w-100" defaultValue={announcement.text} onChange={(e) => {autoResizeTextarea(e.target); setText(e.target.value)}}></textarea>
                        <div className="d-flex mt-1">
                            <button id="save-edit-announcement" className="btn btn-primary m-2 rounded-15" onClick={saveEditAnnouncement}>Save</button>
                            <button id="cancel-edit-announcement" className="me-auto btn btn-secondary m-2 rounded-15" onClick={cancelEditAnnouncement}>Cancel</button>
                        </div>
                    </div>

                    
                </div>
                
                
            </div>
        </div>
    );
    
}