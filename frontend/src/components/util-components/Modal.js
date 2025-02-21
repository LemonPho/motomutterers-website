import React from "react";
import { useModalsContext } from "../ModalsContext";

export default function Modal({ isOpen, children }){
    if(!isOpen) return null;

    const { closeModal } = useModalsContext();

    return <>
        <div id="background-blur" className="overlay" onClick={(e) => {e.stopPropagation(); closeModal();}}></div>
        {children}
    </>;
}