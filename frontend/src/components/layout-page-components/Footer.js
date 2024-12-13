import React from "react";
import { useApplicationContext } from "../ApplicationContext";

export default function Footer(){
    const { setSuccessMessage, resetApplicationMessages, setErrorMessage } = useApplicationContext();

    return(
        <div className="footer">
            <a href="/contact"><small>Contact us</small></a>
        </div>
    );
}