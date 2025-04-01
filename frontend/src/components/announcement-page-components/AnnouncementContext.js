import React, { useContext } from "react";
import { createContext, useState } from "react";
import { useApplicationContext } from "../ApplicationContext";
import { getAnnouncement } from "../fetch-utils/fetchGet";
import { Outlet, useParams } from "react-router-dom";
import { submitAnnouncementComment, submitAnnouncementCommentReply, submitDeleteAnnouncement, submitDeleteAnnouncementComment, submitEditAnnouncement, submitEditAnnouncementComment } from "../fetch-utils/fetchPost";
import useImagesContext from "../ImagesContext";


const AnnouncementContext = createContext()

export default function AnnouncementContextProvider(){
    const { setErrorMessage, setSuccessMessage, resetApplicationMessages, setLoadingMessage } = useApplicationContext();
    const { prepareProfilePictures } = useImagesContext();

    const {announcementId} = useParams();
    const [announcement, setAnnouncement] = useState({});
    const [announcementLoading, setAnnouncementLoading] = useState(true);

    //--------------------------------ANNOUNCEMENTS-------------------------------------------//
    async function retrieveAnnouncement(){
        resetApplicationMessages();
        setLoadingMessage("Loading...");
        setAnnouncementLoading(true);
        if(announcementId === null){
            setAnnouncement(false);
            return;
        }

        const announcementResponse = await getAnnouncement(announcementId);
        setLoadingMessage(false);

        if(announcementResponse.status == 404){
            setAnnouncement(false);
            setAnnouncementLoading(false);
            return;
        }

        if(announcementResponse.error || announcementResponse.status != 200){
            setErrorMessage("There was an error loading the announcement");
            setAnnouncementLoading(false);
            return;
        }

        setAnnouncement(announcementResponse.announcement);
        prepareProfilePictures([announcementResponse.announcement.user]);
        setAnnouncementLoading(false);
    };

    async function editAnnouncement(title, text, announcementId){
        resetApplicationMessages();
        setLoadingMessage("Loading...");
        const announcementResponse = await submitEditAnnouncement(title, text, announcementId);
        setLoadingMessage(false);

        if(announcementResponse.error){
            setErrorMessage("There was an error saving the changes");
            return false;
        }

        if(announcementResponse.status === 400){
            setErrorMessage("Be sure the title has a limit of 128 characters and the text 2048");
            return false;
        }

        if(announcementResponse.status === 200){
            setSuccessMessage("Announcement changes saved");
            return true;
        }

        setErrorMessage("There was an error saving the changes");
        return false;
    }

    async function deleteAnnouncement(announcementId){
        resetApplicationMessages();
        setLoadingMessage("Loading...");
        const announcementResponse = await submitDeleteAnnouncement(announcementId);
        setLoadingMessage(false);

        if(announcementResponse.error || announcementResponse.status != 200){
            setErrorMessage("There was an error deleting the announcement");
            return;
        }

        setSuccessMessage("Announcement successfully deleted");
        return;
    }

    return(
        <AnnouncementContext.Provider value={{  announcement, retrieveAnnouncement, editAnnouncement, deleteAnnouncement, announcementLoading, }}>
            <Outlet/>
        </AnnouncementContext.Provider>
    );
}

export function useAnnouncementContext(){
    return useContext(AnnouncementContext);
}