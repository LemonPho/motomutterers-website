import React from "react";
import { useOpenersContext } from "../OpenersContext";

export default function Dropdown({ isOpen, children }){
    if(!isOpen) return null;

    const { closeDropdown } = useOpenersContext();

    return <>
        {children}
    </>;
}