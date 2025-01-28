import React, { useEffect, useState } from "react";
import { useApplicationContext } from "../ApplicationContext";

export default function ProfilePictureLazyLoader({ username, width, height }){
    const { retrieveProfilePicture } = useApplicationContext();

    const [profilePicture, setProfilePicture] = useState({});
    const [profilePictureLoading, setProfilePictureLoading] = useState(true);

    useEffect(() => {
        if(!username){
            return;
        }

        async function getData(){
            setProfilePictureLoading(true)
            setProfilePicture(await retrieveProfilePicture(username));
            setProfilePictureLoading(false);
        }

        getData();
    }, [username])

    if(profilePictureLoading){
        return(
            <span className="fading-circle" style={{ width: width, height: height }}></span>
        );
    }

    return(
        <img className="rounded-circle" style={{ width: width, height: height }} src={`data: image/${profilePicture.format}; base64, ${profilePicture.data}`} alt="" />        
    );
}