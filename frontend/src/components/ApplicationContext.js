import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { getCurrentUser, getLoggedIn, getCurrentSeason, getSelectPicksState, getUserProfilePicture } from "./fetch-utils/fetchGet";
import { useNavigate } from "react-router-dom";

const ApplicationContext = createContext();

export function ApplicationContextProvider({children}){
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [currentSeason, setCurrentSeason] = useState();
    const [currentSeasonLoading, setCurrentSeasonLoading] = useState(true);
    const [contextLoading, setContextLoading] = useState(true);
    const [selectPicksState, setSelectPicksState] = useState(false);
    const [selectPicksStateLoading, setSelectPicksStateLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [informationMessage, setInformationMessage] = useState(false);
    const [modalErrorMessage, setModalErrorMessage] = useState(false);
    const [modalSuccessMessage, setModalSuccessMessage] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(false);

    const [profilePictures, setProfilePictures] = useState([]);

    const navigate = useNavigate();

    function resetApplicationMessages(){
        setErrorMessage(false);
        setSuccessMessage(false);
        setInformationMessage(false);
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
        setSelectPicksStateLoading(true);
        const selectPicksStateResponse = await getSelectPicksState();

        if(selectPicksStateResponse.error){
            setErrorMessage("There was an error loading the users picks state.");
            console.log(selectPicksStateResponse.error);
            return;
        }

        setSelectPicksState(selectPicksStateResponse.selectPicksState);
        setSelectPicksStateLoading(false);
    }

    async function retrieveCurrentSeason(){
        setCurrentSeasonLoading(true);
        const currentSeasonResponse = await getCurrentSeason();

        if(currentSeasonResponse.status == 200 || currentSeasonResponse.status == 404){
            setCurrentSeason(currentSeasonResponse.season);
            setCurrentSeasonLoading(false);
        } else {
            setErrorMessage("Error loading the current season");
        }
    }

    async function retrieveUserData(){
        setUserLoading(true);
        const userResponse = await getCurrentUser();

        if(userResponse.status === 200){
            setUser(userResponse.user);
            setUserLoading(false);
        } else {
            setErrorMessage("Error loading user data");
        }
    }

    async function retrieveProfilePicture(username){
        for(let i=0; i < profilePictures.length; i++){
            if(profilePictures[i].username == username){
                return profilePictures[i].profilePicture;
            }
        }

        const profilePictureResponse = await getUserProfilePicture(username);

        if(profilePictureResponse.error || profilePictureResponse.status != 200){
            setErrorMessage("There was an error getting one or more profile pictures");
            return;
        }

        const newProfilePicture = {
            username: username, 
            profilePicture: profilePictureResponse.profilePicture,
        }
        
        setProfilePictures((prevProfilePictures) => [...prevProfilePictures, newProfilePicture]);

        return profilePictureResponse.profilePicture;
    }

    async function retrieveApplicationContextData(){
        setContextLoading(true);
        await retrieveUserData();
        await retrieveCurrentSeason();
        await retrievePicksState();
        setContextLoading(false);
    }

    async function setLogout(){
        setUserLoading(true);
        const loginResponse = await getLoggedIn();

        if(!loginResponse.loggedIn){
            await retrieveUserData();
            navigate("/login", {replace: true});
            setUserLoading(false);
        }
    }

    return (
        <ApplicationContext.Provider value={{   
            user, userLoading, contextLoading, retrieveApplicationContextData, retrieveUserData, setLogout, currentSeason, currentSeasonLoading, retrieveCurrentSeason,
            errorMessage, successMessage, modalErrorMessage, modalSuccessMessage, loadingMessage, selectPicksState, selectPicksStateLoading, informationMessage,
            profilePictures, retrieveProfilePicture,
            setErrorMessage, addErrorMessage, setSuccessMessage, setInformationMessage, setModalErrorMessage, setModalSuccessMessage, setLoadingMessage, retrievePicksState,
            resetApplicationMessages }}>
            {children}
        </ApplicationContext.Provider>
    );
}

export function useApplicationContext(){
    return useContext(ApplicationContext);
}

export default ApplicationContext;