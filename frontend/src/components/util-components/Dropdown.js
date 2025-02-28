import React from "react";

export default function Dropdown({ isOpen, children }){
    console.log(isOpen);
    if(!isOpen) return null;

    return <>{children}</>;
}