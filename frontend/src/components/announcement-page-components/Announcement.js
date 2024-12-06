import React, { useEffect } from "react";
import { useAnnouncementContext } from "./AnnouncementContext";
import AnnouncementComments from "./AnnouncementComments";
import AnnouncementContent from "./AnnouncementContent";
import PageNotFound from "../PageNotFound";

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
            <AnnouncementComments />
        </div>
    );
}