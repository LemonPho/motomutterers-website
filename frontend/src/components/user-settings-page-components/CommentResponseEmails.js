import React, { useState } from "react";
import { useApplicationContext } from "../ApplicationContext";
import { submitToggleEmailsNotifications } from "../fetch-utils/fetchPost";

export default function CommentResponseEmails(){
    const { user, setErrorMessage } = useApplicationContext();
    const [checked, setChecked] = useState(user.comment_response_emails);

    async function toggleCommentResponseEmails(){
        setChecked(!checked);
        const COMMENT_RESPONSE_TYPE = 2;

        const emailResponse = await submitToggleEmailsNotifications(COMMENT_RESPONSE_TYPE);

        if(emailResponse.error || emailResponse.status != 201){
            setErrorMessage("There was an error toggling the email notifications");
            setChecked(!checked);
            return;
        }
    }

    return(
        <div className="d-flex align-items-center rounded-15">
            <strong style={{fontSize: "15px"}}>Comment Replies Notifications</strong>
            <div className="ms-auto form-check form-switch">
                <input type="checkbox" className="ms-auto form-check-input" defaultChecked={checked} onChange={toggleCommentResponseEmails}/>
            </div>
        </div>
    );
}