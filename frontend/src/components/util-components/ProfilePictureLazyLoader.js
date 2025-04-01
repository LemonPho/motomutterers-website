import React, { useEffect, useState } from "react";
import useImagesContext from "../ImagesContext";

export default function ProfilePictureLazyLoader({ user, width, height }){
    const { profilePictures, profilePicturesLoading } = useImagesContext();

    if(profilePicturesLoading || profilePictures[user.username] === undefined || !user || profilePictures["default"] === undefined){
        return(
            <div className="fading-circle" style={{ width: width, height: height }}></div>
        );
    }

    return(
        <img className="rounded-circle" style={{ width: width, height: height }} src={`data: image/${user.has_profile_picture ? profilePictures[user.username].format : profilePictures["default"].format}; base64, ${user.has_profile_picture ? profilePictures[user.username].data : profilePictures["default"].data}`} alt="" />        
    );
}