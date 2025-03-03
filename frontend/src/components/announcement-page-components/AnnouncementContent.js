import React, { useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import PageNotFound from "../PageNotFound";
import { useAnnouncementContext } from "./AnnouncementContext";
import { useApplicationContext } from "../ApplicationContext";
import { autoResizeTextarea } from "../utils";
import ProfilePictureLazyLoader from "../util-components/ProfilePictureLazyLoader";
import Dropdown from "../util-components/Dropdown";
import { useOpenersContext } from "../OpenersContext";
import Visible from "../util-components/Visble";
import Textarea from "../util-components/Textarea";

export default function AnnouncementContent(){
    const { user, contextLoading } = useApplicationContext();
    const { announcement, editAnnouncement, retrieveAnnouncement, deleteAnnouncement, announcementLoading } = useAnnouncementContext();
    const { openedDropdown, toggleDropdown, closeDropdown } = useOpenersContext();

    const [announcementEditLoading, setAnnouncementEditLoading] = useState(false);
    const [showEditAnnouncement, setShowEditAnnouncement] = useState(false);
    const [showStaticAnnouncement, setShowStaticAnnouncement] = useState(true);
    const [announcementDeleted, setAnnouncementDeleted] = useState(false);

    const [text, setText] = useState("");
    const [title, setTitle] = useState("");

    function toggleEditAnnouncement(){
        setShowEditAnnouncement(!showEditAnnouncement);
        setShowStaticAnnouncement(!showStaticAnnouncement);
        closeDropdown();
    }

    async function saveEditAnnouncement(){
        setAnnouncementEditLoading(true);
        if(await editAnnouncement(title, text, announcement.id)){
            await retrieveAnnouncement();
            toggleEditAnnouncement();
        }
        setAnnouncementEditLoading(false);
    }

    function saveDeleteAnnouncement(){
        setAnnouncementEditLoading(true);
        if(deleteAnnouncement(announcement.id)){
            setAnnouncementDeleted(true);
        }
        setAnnouncementEditLoading(false);
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
            <div className="card rounded-15 element-background-color element-border-color p-2" id="announcement-card">
                <Visible isVisible={showStaticAnnouncement}>
                    <div id="static-div" className="">
                        <div className="card-header d-flex align-items-center p-3 mb-2 nested-element-color rounded-15">
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
                        <div className="break-line-text card-body rounded-15 nested-element-color">
                            <div id="announcement-text" className="">{announcement.text}</div>
                        </div>
                    </div>
                </Visible>

                <Visible isVisible={showEditAnnouncement}>
                    <div id="edit-div">
                        <div className="card-header d-flex align-items-center p-3 mb-2 rounded-15 nested-element-color">
                            <Textarea placeholder={announcement.title} id="announcement-title-input" value={announcement.title} setValue={setTitle} onEnterFunction={saveEditAnnouncement}/>
                        </div>

                        <div className="card-body nested-element-color rounded-15">
                            <Textarea placeholder={announcement.text} id="announcement-text-input" value={announcement.text} setValue={setText} onEnterFunction={saveEditAnnouncement}/>
                            <div className="d-flex mt-1">
                                <button id="save-edit-announcement" className="btn btn-primary m-2 rounded-15" onClick={saveEditAnnouncement}>Save</button>
                                <button id="cancel-edit-announcement" className="me-auto btn btn-outline-secondary m-2 rounded-15" onClick={() => {setShowEditAnnouncement(false);setShowStaticAnnouncement(true)}}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </Visible>
            </div>
        </div>
    );
    
}