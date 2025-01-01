import React, { useState, useEffect, useContext } from "react";

import { dataURLtoFile, toggleModal, closeModals } from "../utils";
import { submitChangeProfilePicture } from "../fetch-utils/fetchPost";
import { getCurrentUser } from "../fetch-utils/fetchGet";

import ApplicationContext, { useApplicationContext } from "../ApplicationContext";

export default function ProfilePictureSettings(){
    const [errorOcurred, setErrorOcurred] = useState(null);

    const [selectedPhoto, setSelectedPhoto] = useState(false);
    const [photoPreview, setPhotoPreview] = useState();
    const [changeProfilePictureLoading, setChangeProfilePictureLoading] = useState(null);

    const {user, contextLoading, modalErrorMessage, setModalErrorMessage, setSuccessMessage, retrieveUserData, resetApplicationMessages} = useApplicationContext();

    //change photo preview
    useEffect(() => {
        if(!selectedPhoto){
            setPhotoPreview(undefined);
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                //cropping image to center
                let cropWidth, cropHeight, offsetX, offsetY;

                if(img.width > img.height){
                    cropWidth = img.height;
                    cropHeight = img.height;

                    offsetX = (img.width - img.height) / 2;
                    offsetY = 0;
                } else {
                    cropWidth = img.width;
                    cropHeight = img.width;
                    offsetY = (img.height - img.width) / 2;
                    offsetX = 0;
                }

                canvas.width = cropWidth;
                canvas.height = cropHeight;

                ctx.drawImage(img, offsetX, offsetY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

                const croppedImage = canvas.toDataURL(selectedPhoto.type);
                setPhotoPreview(croppedImage);
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(selectedPhoto);
    }, [selectedPhoto]);

    function changePhotoPreview(event) {
        if(!event.target.files || event.target.files.length === 0){
            setSelectedPhoto(false);
            return;
        }

        setSelectedPhoto(event.target.files[0]);
    }

    async function postNewProfilePicture(){
        setChangeProfilePictureLoading(true);

        const imageFile = dataURLtoFile(photoPreview, "new-profile-picture");
        const extensionString = imageFile.type;
        const fileExtension = extensionString.match(/\/([a-zA-Z]+)/)[1];

        const formData = new FormData();
        formData.append("profile_picture", imageFile);

        const profilePictureResponse = await submitChangeProfilePicture(formData, fileExtension);

        if(profilePictureResponse.error){
            setModalErrorMessage("There was an error while submiting the new profile picture");
            console.log(profilePictureResponse.error);
            setChangeProfilePictureLoading(false);
            return;
        }

        if(profilePictureResponse.status === 400){
            setModalErrorMessage("File format or another factor is invalid for a picture, be sure to use any common picture extensions");
            setChangeProfilePictureLoading(false);
            return;
        }

        if(profilePictureResponse.status === 200){
            setSuccessMessage("Profile picture changed");
            closeModals();
            setChangeProfilePictureLoading(false);
            retrieveUserData();
            setSelectedPhoto(false);
            return;
        }

        setModalErrorMessage("There was an error when submiting the new profile picutre");
        setChangeProfilePictureLoading(false);
    }

    if(contextLoading){
        return null;
    }

    return(
        <div>
            <div className="p-3 d-flex justify-content-center">
                <div>
                    <div>
                        <strong style={{fontSize: "20px"}}>Profile photo</strong>
                    </div>
                    <div>
                        {user.profile_picture_data != "" && <img id="profile-picture-div" style={{width: "7rem", height: "7rem"}} className="rounded-circle" src={`data: image/${user.profile_picture_format}; base64, ${user.profile_picture_data}`} alt={user.username} />}
                    </div>
                </div>
                <button id="profile-picture-button" className="btn btn-outline-secondary rounded-15 align-self-center ms-auto" onClick={(e) => {resetApplicationMessages();toggleModal("profile-picture-modal", e)}}>Change</button>
                <div className="custom-modal hidden" id="profile-picture-modal" onClick={(e) => {e.stopPropagation();}}>
                    <div className="custom-modal-header">
                        <h5>Change profile picture</h5>
                        <button type="button" className="btn btn-link link-no-decorations ms-auto" id="close-modal">
                            <span onClick={(e) => {resetApplicationMessages(); closeModals(); setPhotoPreview(undefined);}} id="close-modal" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="custom-modal-body">
                        <div style={{position: "relative"}}>
                            {modalErrorMessage && <div className="alert alert-danger"><small>{modalErrorMessage}</small></div>}
                            {changeProfilePictureLoading && <div className="alert alert-secondary">Loading...</div>}
                            <div className="d-flex justify-content-center">
                                <div style={{position: "relative"}}>
                                    <label>
                                        {selectedPhoto === false && <img className="rounded-circle" id="edit-profile-photo" style={{width: "14rem", height: "14rem"}} src={`data: image/${user.profile_picture_format}; base64, ${user.profile_picture_data}`}></img>}
                                        {selectedPhoto && <img className="rounded-circle" id="edit-profile-photo" style={{width: "14rem", height: "14rem"}} src={photoPreview}></img>}
                                        <input type="file" accept="image/*" onChange={changePhotoPreview}/>
                                        <div className="d-flex justify-content-center align-content-center">
                                            <div className="edit-image-overlay rounded-circle" style={{backgroundColor: "rgba(0, 0, 0, 0.8)"}}>
                                                <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" style={{width: "10rem", height: "10rem"}} width="16" height="16" fill="white" className="bi bi-images" viewBox="0 0 16 16">
                                                        <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                                                        <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="custom-modal-footer justify-content-center">
                        <button id="submit-data" className="btn btn-primary" onClick={(e) => {e.stopPropagation(); resetApplicationMessages(); postNewProfilePicture();}}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
    
    
}