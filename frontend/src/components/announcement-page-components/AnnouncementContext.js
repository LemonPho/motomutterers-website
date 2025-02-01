import React, { useContext } from "react";
import { createContext, useState } from "react";
import { useApplicationContext } from "../ApplicationContext";
import { getAnnouncement } from "../fetch-utils/fetchGet";
import { Outlet, useParams } from "react-router-dom";
import { submitAnnouncementComment, submitAnnouncementCommentReply, submitDeleteAnnouncement, submitDeleteAnnouncementComment, submitEditAnnouncement, submitEditAnnouncementComment } from "../fetch-utils/fetchPost";


const AnnouncementContext = createContext()

export default function AnnouncementContextProvider(){
    const { setErrorMessage, setSuccessMessage, resetApplicationMessages } = useApplicationContext();

    const {announcementId} = useParams();
    const [announcement, setAnnouncement] = useState({});
    const [announcementLoading, setAnnouncementLoading] = useState(true);
<<<<<<< HEAD
=======

    function resetAnnouncementsMessages(){
        setCommentsErrorMessage(false);
    }
>>>>>>> new_features

    //--------------------------------ANNOUNCEMENTS-------------------------------------------//
    async function retrieveAnnouncement(){
        setAnnouncementLoading(true);
        if(announcementId === null){
            setAnnouncement(false);
            return;
        }

        const announcementResponse = await getAnnouncement(announcementId);

        if(announcementResponse.status == 404){
            setAnnouncement(false);
            setAnnouncementLoading(false);
            return;
        }

        if(announcementResponse.error || announcementResponse.status != 200){
            console.log(announcementResponse.error)
            setErrorMessage("There was an error loading the announcement");
            setAnnouncementLoading(false);
            return;
        }

        setAnnouncement(announcementResponse.announcement);
        setAnnouncementLoading(false);
    };

    async function editAnnouncement(title, text, announcementId){
        const announcementResponse = await submitEditAnnouncement(title, text, announcementId);

        if(announcementResponse.error){
            console.log(announcementResponse.error);
            setErrorMessage("There was an error saving the changes");
            return;
        }

        if(announcementResponse.status === 400){
            setErrorMessage("Be sure the title has a limit of 128 characters and the text 2048");
            return;
        }

        if(announcementResponse.status === 200){
            setSuccessMessage("Announcement changes saved");
            return;
        }

        setErrorMessage("There was an error saving the changes");
        return;
    }

    async function deleteAnnouncement(announcementId){
        const announcementResponse = await submitDeleteAnnouncement(announcementId);

        if(announcementResponse.error || announcementResponse.status != 200){
            console.log(announcementResponse.error);
            setErrorMessage("There was an error deleting the announcement");
            return;
        }

        setSuccessMessage("Announcement successfully deleted");
        return;
    }

<<<<<<< HEAD

    //---------------------------------COMMENTS-----------------------------------------------//

    async function createComment(text){
        resetApplicationMessages();
        const commentResponse = await submitAnnouncementComment(text, announcement.id);

        if(commentResponse.error){
            setErrorMessage("There was an error posting the comment");
            console.log(commentResponse.error);
            return false;
        }
        
        if(commentResponse.status != 200){
            setErrorMessage("Comment is invalid");
            return false;
        }

        //reload comments to load the comment after its sent (NEEDS CHANGING)
        retrieveAnnouncement();
        return true;
        
    }

    async function editComment(text, commentId){
        
        const commentResponse = await submitEditAnnouncementComment(text, commentId);

        if(commentResponse.error){
            setErrorMessage("There was an error editing the comment");
            console.log(commentResponse.error);
            return false;
        }

        if(commentResponse.status != 200){
            setErrorMessage("Comments have a max character count of 2048 characters");
            return false;
        }

        retrieveAnnouncement();
        return true;
    }

    async function deleteComment(commentId){
        
        const commentResponse = await submitDeleteAnnouncementComment(commentId);

        if(commentResponse.error || commentResponse.status != 200){
            setErrorMessage("There was an error deleting the comment");
            console.log(commentResponse.error);
            return;
        }

        retrieveAnnouncement();
        return;
    }

    async function createCommentReply(text, commentId){
        
        const replyResponse = await submitAnnouncementCommentReply(text, commentId, announcement.id);

        if(replyResponse.error || replyResponse.status != 200){
            setErrorMessage("Error submiting the comment");
            console.log(replyResponse.error);
            return false;
        }

        //TODO: make a system where it only retrieves the singular comment to then update it, not eficient to update the whole announcement
        retrieveAnnouncement();
        return true;
    }
    

    return(
        <AnnouncementContext.Provider value={{  announcement, comments, retrieveAnnouncement, editAnnouncement, deleteAnnouncement, announcementLoading, 
                                                editComment, deleteComment,
                                                createCommentReply, createComment}}>
=======
    return(
        <AnnouncementContext.Provider value={{  announcement, retrieveAnnouncement, editAnnouncement, deleteAnnouncement, announcementLoading, 
                                                resetAnnouncementsMessages,
                                                }}>
>>>>>>> new_features
            <Outlet/>
        </AnnouncementContext.Provider>
    );
}

export function useAnnouncementContext(){
    return useContext(AnnouncementContext);
}