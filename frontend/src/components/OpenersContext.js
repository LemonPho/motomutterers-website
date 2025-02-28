import React, { createContext, useContext, useState } from "react";

const OpenersContext = createContext();

export function OpenersContextProvider({ children }){
    const [openedModal, setOpenedModal] = useState("");
    const [openedDropdown, setOpenedDropdown] = useState("");

    function openModal(id){
        closeDropdown();
        setOpenedModal(id);
    }

    function toggleDropdown(id, event, loggedIn){

        closeModal();
        console.log("opening dropdown");
        event.stopPropagation();
        if(id == openedDropdown){
            setOpenedDropdown("");
        } else if(id != undefined && (loggedIn == undefined || loggedIn == true)){
            setOpenedDropdown(id);
        }
    }

    function closeModal(){
        setOpenedModal("");
    }

    function closeDropdown(){
        setOpenedDropdown("");
    }

    return(
        <OpenersContext.Provider value={{
            openedModal, openModal, closeModal, openedDropdown, toggleDropdown, closeDropdown}}>

            {children}
        </OpenersContext.Provider>
    )
}

export function useOpenersContext(){
    return useContext(OpenersContext);
}

export default OpenersContext;