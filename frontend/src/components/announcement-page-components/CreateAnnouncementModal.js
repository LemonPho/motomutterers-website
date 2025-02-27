import React, { useState } from "react";
import ProfilePictureLazyLoader from "../util-components/ProfilePictureLazyLoader";
import { autoResizeTextarea } from "../utils";
import { useApplicationContext } from "../ApplicationContext";
import { useModalsContext } from "../ModalsContext";
import { submitAnnouncement } from "../fetch-utils/fetchPost";

export default function CreateAnnouncementModal(){
    const { user, userLoading, resetApplicationMessages, setLoadingMessage, setErrorMessage, setSuccessMessage } = useApplicationContext();
    const { closeModal } = useModalsContext();

    const [announcementTitle, setAnnouncementTitle] = useState("");
    const [announcementText, setAnnouncementText] = useState("");

    async function postAnnouncement(){
        resetApplicationMessages();
        setLoadingMessage("Loading..");
        if(!user.is_admin){
            setErrorMessage("There was an error submiting the announcement");
            return;
        }

        const announcementResponse = await submitAnnouncement(announcementTitle, announcementText);
        setLoadingMessage(false);

        if(announcementResponse.error){
            setErrorMessage("There was an error submiting the announcement");
            return;
        }

        if(announcementResponse.status === 400){
            setErrorMessage("Be sure the title has less than 128 characters and the text 2048 characters");
            return;
        }

        if(announcementResponse.status === 200){
            setSuccessMessage("Announcement posted");
            setAnnouncementText("");
            setAnnouncementTitle("");
            closeModal();
            return;
        }

        setErrorMessage("There was a server error while submiting the announcement");
        return;
    }

    return(
        <div className="custom-modal" id="announcement-create-modal" style={{width: "50%"}} onClick={(e) => {e.stopPropagation();}}>
            <div className="custom-modal-header justify-content-center">                                
                <h5 className='m-0'>Create announcement</h5>
            </div>
            <div className="custom-modal-body">
                <hr className='m-1' />
                <div className='d-flex align-items-center'>
                    {!userLoading && <ProfilePictureLazyLoader width={"3rem"} height={"3rem"} username={user.username}/>}
                    {!userLoading && <strong className='ms-2'>{user.username}</strong>}
                </div>
                <textarea id="announcement-title" className='input-field mt-2 textarea-expand w-100' rows={1} placeholder="Title..." data-category="input-field" onChange={(e) => {autoResizeTextarea(e.target)}} onInput={(e) => {setAnnouncementTitle(e.target.value)}}></textarea>
                <textarea id="break-line-text" className='input-field mt-2 textarea-expand w-100' rows={1} placeholder="Text..." data-category="input-field" onChange={(e) => {autoResizeTextarea(e.target)}} onInput={(e) => {setAnnouncementText(e.target.value)}}></textarea>
            </div>
            <div className="custom-modal-footer">
                <button id="submit-data" className="btn btn-primary me-auto rounded-15" onClick={postAnnouncement}>Post announcement</button>
            </div>
        </div>
    );
}