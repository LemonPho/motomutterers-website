import React, { createContext, useContext, useState, useEffect } from "react";
import { getLoggedIn, getCurrentUser, getCurrentSeason, getSelectPicksState } from "./fetch-utils/fetchGet";
import { useNavigate } from "react-router-dom";

const ApplicationContext = createContext();

export function ApplicationContextProvider({children}){
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [currentSeason, setCurrentSeason] = useState();
    const [competitorsSortedNumber, setCompetitorsSortedNumber] = useState();
    const [contextLoading, setContextLoading] = useState(true);
    const [selectPicksState, setSelectPicksState] = useState(false);

    const [errorMessage, setErrorMessage] = useState(false);
    const [secondaryErrorMessage, setSecondaryErrorMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [secondarySuccessMessage, setSecondarySuccessMessage] = useState(false);
    const [modalErrorMessage, setModalErrorMessage] = useState(false);
    const [modalSuccessMessage, setModalSuccessMessage] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(false);

    const navigate = useNavigate();

    function resetApplicationMessages(){
        setErrorMessage(false);
        setSecondaryErrorMessage(false);
        setSecondarySuccessMessage(false);
        setSuccessMessage(false);
        setModalErrorMessage(false);
        setModalSuccessMessage(false);
        setLoadingMessage(false);
    }

    function addErrorMessage(message){
        setErrorMessage((prevErrorMessage) => {
            let newErrorMessage = prevErrorMessage;
            if(!prevErrorMessage){
                return message;
            }
            newErrorMessage += "\n";
            newErrorMessage += message;
            return newErrorMessage;
        })
    }

    async function retrievePicksState(){
        const selectPicksStateResponse = await getSelectPicksState();

        if(selectPicksStateResponse.error){
            setErrorMessage("There was an error loading the users picks state.");
            console.log(selectPicksStateResponse.error);
            return;
        }

        setSelectPicksState(selectPicksStateResponse.selectPicksState);
    }

    async function retrieveCurrentSeason(){
        const currentSeasonResponse = await getCurrentSeason();

        if(currentSeasonResponse.status == 200 || currentSeasonResponse.status == 404){
            setCurrentSeason(currentSeasonResponse.season);
            setCompetitorsSortedNumber(currentSeasonResponse.competitorsSortedNumber);
        } else {
            setErrorMessage("Error loading the current season");
        }
    }

    async function retrieveUserData(){
        const userResponse = await getCurrentUser();
        const loginResponse = await getLoggedIn();

        if(userResponse.status === 200 && (loginResponse.status === 200 || loginResponse.status === 204)){
            setUser(userResponse.user);
            setLoggedIn(loginResponse.loggedIn);
        } else {
            setErrorMessage("Error loading user data");
        }
    }

    async function retrieveApplicationContextData(){
        setLoadingMessage("Loading...");
        setContextLoading(true);
        await retrieveUserData();
        await retrieveCurrentSeason();
        await retrievePicksState();
        setContextLoading(false);
        setLoadingMessage(false);
    }

    async function setLogout(){
        setContextLoading(true);
        setLoadingMessage("Loading...");
        const loginResponse = await getLoggedIn();

        if(!loginResponse.loggedIn){
            setUser(null);
            setLoggedIn(false);
            navigate("/login", {replace: true});
        }
        setLoadingMessage(false);
        setContextLoading(false);
    }

    return (
        <ApplicationContext.Provider value={{   user, loggedIn, contextLoading, retrieveApplicationContextData, retrieveUserData, setLogout, currentSeason, competitorsSortedNumber, retrieveCurrentSeason,
                                                errorMessage, successMessage, modalErrorMessage, modalSuccessMessage, loadingMessage, selectPicksState,
                                                setErrorMessage, addErrorMessage, setSuccessMessage, setModalErrorMessage, setModalSuccessMessage, setLoadingMessage,
                                                resetApplicationMessages }}>
            {children}
        </ApplicationContext.Provider>
    );
}

export function useApplicationContext(){
    return useContext(ApplicationContext);
}

export default ApplicationContext;