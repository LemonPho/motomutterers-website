import React from "react";
import { useApplicationContext } from "../ApplicationContext";
import { Outlet } from "react-router-dom";

export default function Content(){
    const { errorMessage, successMessage, loadingMessage, informationMessage } = useApplicationContext();

    return(
        <div className="inner-content px-3 mt-4">
            <Outlet />
        </div>
    );
}