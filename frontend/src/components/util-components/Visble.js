import React from "react";

export default function Visible({ isVisible, children }){
    if(!isVisible) return null;

    return(<>{children}</>);
} 