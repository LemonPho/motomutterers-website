import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserDefaultProfilePicture, getUserProfilePictures } from "./fetch-utils/fetchGet";
import { useApplicationContext } from "./ApplicationContext";

const ImagesContext = createContext();

export function ImagesContextProvider({ children }){
    const { user, userLoading } = useApplicationContext();
    const [profilePictures, setProfilePictures] = useState({});
    const [profilePicturesLoading, setProfilePicturesLoading] = useState(null);
    const [profilePicturesQueue, setProfilePicturesQueue] = useState([]);

    async function prepareProfilePictures(userList, useQueue){
        const newUserList = userList.filter(item => item.has_profile_picture).map(item => item.username);

        if(profilePicturesLoading){
            setProfilePicturesQueue(prevItems => ([
                ...prevItems,
                ...newUserList,
            ]));
            return;
        }

        setProfilePicturesLoading(true);
        let retrieveProfilePictureList = [];
        if(!useQueue){
            for(let i=0; i < newUserList.length; i++){
                if(profilePictures[newUserList[i]] === undefined){
                    retrieveProfilePictureList.push(newUserList[i]);
                }
            }
        } else {
            for(let i=0; i < profilePicturesQueue.length; i++){
                if(profilePictures[profilePicturesQueue[i]] === undefined){
                    retrieveProfilePictureList.push(profilePicturesQueue[i]);
                }
            }
        }

        if(retrieveProfilePictureList.length == 0){
            setProfilePicturesLoading(false);
            return;
        }

        retrieveProfilePictureList = [...new Set(retrieveProfilePictureList)];

        const profilePicturesResponse = await getUserProfilePictures(retrieveProfilePictureList);

        if(!profilePicturesResponse.error && profilePicturesResponse.status === 200){
            setProfilePictures(prevPictures => ({
                ...prevPictures,
                ...profilePicturesResponse.profilePictures,
            }));
        }
        setProfilePicturesLoading(false);
    }

    async function initializeProfilePictures(){
        const profilePictureResponse = await getUserDefaultProfilePicture();
        if(!profilePictureResponse.error && profilePictureResponse.status === 200){
            setProfilePictures({default: profilePictureResponse.profilePicture});
        }
    }


    useEffect(() => {
        if(userLoading) return;
        if(profilePictures[user.username] === undefined){
            prepareProfilePictures([user]);
        }
    }, [userLoading]);

    useEffect(() => {
        if(profilePicturesQueue.length != 0){
            prepareProfilePictures([], true);
        }
    }, [profilePicturesLoading, profilePicturesQueue]);

    useEffect(() => {
        async function startInitialize(){
            await initializeProfilePictures();
        }

        startInitialize();
    }, []);

    return(
        <ImagesContext.Provider value={{
            profilePictures, prepareProfilePictures, profilePicturesLoading
        }}>

            {children}
        </ImagesContext.Provider>
    )
}

export default function useImagesContext(){
    return useContext(ImagesContext);
}