import React, { createContext, useContext, useState } from "react";

const ModalsContext = createContext();

export function ModalsContextProvider({ children }){
    const [openedModal, setOpenedModal] = useState("");

    function closeModal(){
        setOpenedModal("");
    }

    return(
        <ModalsContext.Provider value={{
            openedModal, setOpenedModal, closeModal}}>

            {children}
        </ModalsContext.Provider>
    )
}

export function useModalsContext(){
    return useContext(ModalsContext);
}

export default ModalsContext;