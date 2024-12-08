import React from "react";
import { useApplicationContext } from "../ApplicationContext";
import { Outlet } from "react-router-dom";

export default function Content(){
    const { errorMessage, successMessage, loadingMessage, informationMessage } = useApplicationContext();

    return(
        <div className="content">
            <div className="inner-content">
                {errorMessage && <div className="alert alert-danger my-2" style={{whiteSpace: "pre-line"}}>{errorMessage}</div>}
                {successMessage && <div className="alert alert-success my-2" style={{whiteSpace: "pre-line"}}>{successMessage}</div>}
                {loadingMessage && <div className="alert alert-secondary my-2" style={{whiteSpace: "pre-line"}}>{loadingMessage}</div>}
                {informationMessage && <div className="alert alert-information my-2" style={{whiteSpace: "pre-line"}}>{informationMessage}</div>}

                <Outlet />
            </div>
        </div>
    );
}