import React, { useEffect } from "react";
import { useAnnouncementContext } from "./AnnouncementContext";
import AnnouncementComments from "./AnnouncementComments";
import AnnouncementContent from "./AnnouncementContent";
import PageNotFound from "../PageNotFound";
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
        <div id="announcement-view" className="my-3">
            <AnnouncementContent />
            <CommentsSection comments={announcement.comments} parentElement={{id: announcement.id, type: "ANNOUNCEMENT"}}/>
        </div>
    );
}