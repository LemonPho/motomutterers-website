import React, { useState } from "react";
import { useApplicationContext } from "../ApplicationContext";
import { submitToggleEmailsNotifications } from "../fetch-utils/fetchPost";

export default function AnnouncementResponseEmails(){
    const { user, setErrorMessage } = useApplicationContext();
    const [checked, setChecked] = useState(user.announcement_response_emails);

    async function toggleAnnouncementResponseEmails(){
        setChecked(!checked);
        const ANNOUNCEMENT_RESPONSE_TYPE = 3;

        const emailResponse = await submitToggleEmailsNotifications(ANNOUNCEMENT_RESPONSE_TYPE);

        if(emailResponse.error || emailResponse.status != 201){
            setErrorMessage("There was an error toggling the email notifications");
            setChecked(!checked);
            return;
        }
    }

    return(
        <div className="d-flex align-items-center rounded-15">
            <strong style={{fontSize: "15px"}}>Announcement Replies Notifications</strong>
            <div className="ms-auto form-check form-switch">
                <input type="checkbox" className="ms-auto form-check-input" defaultChecked={checked} onChange={toggleAnnouncementResponseEmails}/>
            </div>
        </div>
    );
}