import React, { useState } from "react";
import { useApplicationContext } from "../ApplicationContext";
import { submitToggleEmailsNotifications } from "../fetch-utils/fetchPost";

export default function RaceWeekendEmails(){
    const { user, setErrorMessage } = useApplicationContext();

    const [ checked, setChecked ] = useState(user.race_weekends_emails);

    async function toggleRaceWeekendsEmails(){
        const tempChecked = checked;
        setChecked(!checked);
        const RACE_WEEKEND_TYPE = 1;

        const emailResponse = await submitToggleEmailsNotifications(RACE_WEEKEND_TYPE);

        if(emailResponse.error || emailResponse.status != 201){
            setErrorMessage("There was an error toggling the email notifications");
            setChecked(tempChecked);
            return;
        }
    }

    return(
        <div className="d-flex align-items-center rounded-15">
            <strong style={{"fontSize": "15px"}}>Race Weekends Notifications</strong>
            <div className="ms-auto form-check form-switch">
                <input type="checkbox" className="ms-auto form-check-input" defaultChecked={checked} onChange={toggleRaceWeekendsEmails}/>
            </div>
        </div>
    );
}