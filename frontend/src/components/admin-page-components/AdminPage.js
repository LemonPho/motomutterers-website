import React, { useState, useEffect, useContext } from "react";

import ApplicationContext, { useApplicationContext } from "../ApplicationContext";
import SeasonsSettings from "./SeasonsSettings";

export default function Admin(){

    const {user, contextLoading} = useApplicationContext();

    if(contextLoading){
        return null;
    }

    if(user.is_admin){
        return(
            <div className="d-flex">
                <div className="card rounded-15 flex-grow-1 element-background-color element-border-color">
                    <SeasonsSettings/>
                </div>
            </div>
        );
    } else {
        return(
            <div>You don't have admin permissions</div>
        );
    }
    
}