import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getNotifications } from "../fetch-utils/fetchGet";

import { useApplicationContext } from "../ApplicationContext";
import { readNotification } from "../fetch-utils/fetchPost";
import { toggleDropdown } from "../utils";
import { useOpenersContext } from "../OpenersContext";
import Dropdown from "../util-components/Dropdown";

//TODO: create system to check notifications when clicking on the bell!

export default function NotificationsDropdown(){
    const { user, userLoading } = useApplicationContext();
    const { openedDropdown, toggleDropdown } = useOpenersContext();

    const [notifications, setNotifications] = useState([]);
    const [newNotifications, setNewNotifications] = useState(false);

    const navigate = useNavigate();

    async function notificationClick(event, notificationId){
        event.preventDefault();
        const link = event.currentTarget.getAttribute("href");
        let readResponse = await readNotification(notificationId);

        if(readResponse.error || readResponse.status !== 200){
            setErrorOcurred(true);
            return;
        }

        setNotifications((prevNotifications) =>
            prevNotifications.filter(notification => notification.id !== notificationId)
        );        

        navigate(link);
    };

    useEffect(() => {
        if(!userLoading && user.is_logged_in){
            setNotifications(user.notifications);
        }
    }, [user]);

    useEffect(() => {
        if(notifications == null){
            return;
        }
        if(notifications.length == 0){
            setNewNotifications(false);
        } else {
            setNewNotifications(true);
        }
    }, [notifications])

    if(userLoading){
        return null;
    }

    if(!user.is_logged_in){
        return null;
    }
    
    return(
        <div className="dropdown-div">
            {newNotifications ? 
            (
                <div id="notifications-dropdown-button" className="dropdown-button" onClick={(e) => toggleDropdown("notifications-dropdown-content", e, user.is_logged_in)}>
                    <svg style={{marginRight: "0.5rem"}} xmlns="http://www.w3.org/2000/svg" fill="#000000" width="1.75rem" height="1.75rem" viewBox="0 0 24 24" className="icon line">
                        <path d="M19.38,14.38a2.12,2.12,0,0,1,.62,1.5h0A2.12,2.12,0,0,1,17.88,18H6.12A2.12,2.12,0,0,1,4,15.88H4a2.12,2.12,0,0,1,.62-1.5L6,13V9a6,6,0,0,1,6-6h0a6,6,0,0,1,6,6v4ZM15,18H9a3,3,0,0,0,3,3h0A3,3,0,0,0,15,18Z" style={{fill: "none", stroke: "rgb(0, 0, 0)", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5"}}/>
                        <circle cx="18" cy="6" r="4" fill="red" />
                    </svg>
                </div>
                
            )
            :
            (
                <div id="notifications-dropdown-button" className="dropdown-button" onClick={(e) => toggleDropdown("notifications-dropdown-content", e, user.is_logged_in)}>
                    <svg style={{marginRight: "0.5rem"}} xmlns="http://www.w3.org/2000/svg" fill="#000000" width="1.75rem" height="1.75rem" viewBox="0 0 24 24" className="icon line">
                        <path d="M19.38,14.38a2.12,2.12,0,0,1,.62,1.5h0A2.12,2.12,0,0,1,17.88,18H6.12A2.12,2.12,0,0,1,4,15.88H4a2.12,2.12,0,0,1,.62-1.5L6,13V9a6,6,0,0,1,6-6h0a6,6,0,0,1,6,6v4ZM15,18H9a3,3,0,0,0,3,3h0A3,3,0,0,0,15,18Z" style={{fill: "none", stroke: "rgb(0, 0, 0)", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5"}}/>
                    </svg>
                </div>
                
            )}
            <Dropdown isOpen={openedDropdown == "notifications-dropdown-content"}>
                <ul style={{width: "80vw", maxWidth: "20rem"}} id="notifications-dropdown-content" className="dropdown-menu">
                    {notifications.length === 0 ? 
                    (
                        <li><span className="dropdown-item disabled" aria-disabled="true">No notifications</span></li>
                        
                    )
                    :
                    (
                        notifications.map((notification) => (
                            <li id={`notification-${notification.id}`} key={`notification-${notification.id}`} className="dropdown-item">
                                <Link className="d-flex link-no-decorations" to={`${notification.path}`} onClick={(e) => notificationClick(e, notification.id)}>
                                    {notification.origin_user == null && <span className="notification-text">{`${notification.text}`}</span>}
                                    {notification.origin_user && <span className="notification-text">{`${notification.origin_user.username} ${notification.text}`}</span>}
                                </Link>
                            </li>
                        ))
                    )}
                </ul>
            </Dropdown>
        </div>
    );
        
    
}