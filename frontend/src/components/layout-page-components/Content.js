import React, { useEffect } from "react";
import { useApplicationContext } from "../ApplicationContext";
import { Outlet } from "react-router-dom";

export default function Content(){

    return(
        <div className="content px-3 mt-4" onClick={(e) => e.stopPropagation()}>
            <Outlet />
        </div>
    );
}