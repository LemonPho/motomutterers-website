import React, { useState } from "react";
import ProfilePictureLazyLoader from "../util-components/ProfilePictureLazyLoader";
import { autoResizeTextarea } from "../utils";
import { useApplicationContext } from "../ApplicationContext";
import { useOpenersContext } from "../OpenersContext";
import { submitAnnouncement } from "../fetch-utils/fetchPost";
import Textarea from "../util-components/Textarea";

export default function CreateAnnouncementModal(){
    const { user, userLoading, resetApplicationMessages, setLoadingMessage, setErrorMessage, setSuccessMessage } = useApplicationContext();
    const { closeModal } = useOpenersContext();

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
                <Textarea id="announcement-title" className="mt-2" placeholder="Title..." value={announcementTitle} setValue={setAnnouncementTitle} onEnterFunction={postAnnouncement}/>
                <Textarea id="break-line-text" className="mt-2" placeholder="Text..." value={announcementText} setValue={setAnnouncementText} onEnterFunction={postAnnouncement}/>
            </div>
            <div className="custom-modal-footer">
                <button id="submit-data" className="btn btn-primary me-auto rounded-15" onClick={postAnnouncement}>Post announcement</button>
            </div>
        </div>
    );
}