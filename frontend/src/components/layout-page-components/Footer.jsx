import React from "react";
import { useApplicationContext } from "../ApplicationContext";
import { Link } from "react-router-dom";

export default function Footer(){
    const { setSuccessMessage, resetApplicationMessages, setErrorMessage } = useApplicationContext();

    return(
        <div className="footer">
            <Link to="/contact"><small>Contact us</small></Link>
        </div>
    );
}