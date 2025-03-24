import React from "react";
import { Link } from "react-router-dom";
import ProfilePictureLazyLoader from "../util-components/ProfilePictureLazyLoader";

export default function AnnouncementCard({ announcement, loading, maxHeight }){

    if(loading || !announcement){
        return(
            <div className="card mx-auto rounded-15 element-background-color" style={{maxHeight: maxHeight}}>
                <div className="card-header d-flex align-items-center">
                    <span className="fading-circle" style={{ width: "2rem", height: "2rem" }}></span>
                    <div className="ms-2 loading-placeholder">
                        <h4 className="fade-in-out"></h4>
                    </div>
                </div>
                <div className="card-body">
                    <div className="loading-placeholder"><h5 className="fade-in-out"></h5></div>
                    <div className="loading-placeholder"><span className="fade-in-out"></span></div>
                </div>
            </div>
        )
    } else {
        return(
            <Link style={{maxHeight: maxHeight}} className='clickable card mx-auto rounded-15 element-background-color link-no-decorations' to={`/announcements/${announcement.id}`}>
                <div className='card-header d-flex align-items-center'>
                    <ProfilePictureLazyLoader width={"2rem"} height="2rem" username={announcement.user.username}/>
                    <small className='ms-2'>{announcement.user.username}</small>
                    <small className='ms-auto'>{new Date(announcement.date_created).toISOString().substring(0,10)}</small>
                </div>
                
                <div className='card-body announcement-card-body'>
                    <h5>{announcement.title}</h5>
                    <span>{announcement.text}</span>
                </div>

                <div className='card-footer'>
                    <small>Comments: {announcement.amount_comments}</small>
                </div>                 
            </Link>
        )
    }
}