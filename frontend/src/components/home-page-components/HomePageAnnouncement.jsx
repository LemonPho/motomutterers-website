import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AnnouncementCard from "../announcement-page-components/AnnouncementCard";
import { getLatestAnnouncement } from "../fetch-utils/fetchGet";
import { useApplicationContext } from "../ApplicationContext";
import useImagesContext from "../ImagesContext";

export default function Announcement({ loading }){
    const { setErrorMessage } = useApplicationContext();
    const { prepareProfilePictures } = useImagesContext();

    const [announcementLoading, setAnnouncementLoading] = useState(true);
    const [announcement, setAnnouncement] = useState({});

    async function retrieveLatestAnnouncement(){
        setAnnouncementLoading(true);
        const announcementResponse = await getLatestAnnouncement();
        setAnnouncementLoading(false);

        if(announcementResponse.error || announcementResponse.status != 200){
            setErrorMessage("There was an error loading the latest announcement");
            setAnnouncement(false);
            return;
        }

        setAnnouncement(announcementResponse.announcement);
        prepareProfilePictures([announcementResponse.announcement.user]);
    }

    useEffect(() => {
        async function fetchData(){
            await retrieveLatestAnnouncement();
        }

        fetchData();
    }, []);

    if(announcementLoading || loading){
        return(
            <div className="card element-background-color element-border-color rounded-15">
                <div className="card-header rounded-15-top nested-element-color link-no-decorations loading-placeholder">
                    <h4 className="fade-in-out"></h4>
                </div>
                <div className="card-body announcement-card-body">
                    <AnnouncementCard announcement={false} loading={loading || announcementLoading} maxHeight={"30vh"}/>
                </div>
            </div>
        );
    } else {
        return(
            <div className="card element-background-color element-border-color rounded-15">
                <Link className="card-header clickable rounded-15-top nested-element-color link-no-decorations" to={`/announcements/?page=1`}>
                    <h4>Announcements</h4>
                </Link>
                <div className="card-body announcement-card-body">
                    <AnnouncementCard announcement={announcement} maxHeight={"30vh"}/>
                </div>
            </div>
        )
    }
}