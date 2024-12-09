import React from "react";
import { useApplicationContext } from "../ApplicationContext";

export default function Footer(){
    const { setSuccessMessage, resetApplicationMessages, setErrorMessage } = useApplicationContext();

    function EmailClicked(){
        resetApplicationMessages();
        navigator.clipboard.writeText("motomutterersfantasyleague@gmail.com").then(() => {
            setSuccessMessage("Email has been copied! Send us an email by pasting in the recipients box when composing.");
        }).catch(err => {
            setErrorMessage("Failed to copy email to clipboard")
        });
        
    }

    return(
        <div className="footer">
            <a href="/contact"><small>Contact us</small></a>
        </div>
    );
}