import React, { useEffect } from "react";
import { useAnnouncementContext } from "./AnnouncementContext";
import AnnouncementContent from "./AnnouncementContent";
import PageNotFound from "../PageNotFound";
import CommentsContextProvider from "../util-components/comments-section-components/CommentsSectionContext";
import CommentsSection from "../util-components/comments-section-components/CommentsSection";

export default function Announcement(){
    const { announcement, announcementLoading, retrieveAnnouncement } = useAnnouncementContext();

    useEffect(() => {
        retrieveAnnouncement();
    }, []);

    if(announcementLoading){
        return null;
    }

    if(!announcement){
        return <PageNotFound />
    }

    return(
        <div id="announcement-view">
            <AnnouncementContent />
            <CommentsContextProvider parentElement={{id: announcement.id, type: "ANNOUNCEMENT"}}>
                <CommentsSection/>
            </CommentsContextProvider>
        </div>
    );
}