import React, { useState, useEffect, useContext } from "react";

import ApplicationContext, { useApplicationContext } from "../ApplicationContext";
import { getCompetitors, getSeasons } from "../fetch-utils/fetchGet";
import { submitCurrentSeason, submitDeleteSeason, submitSeason } from "../fetch-utils/fetchPost";
import { closeDropdowns, enterKeySubmit, toggleDropdown } from "../utils";
import SeasonCreateModal from "./SeasonCreateModal";
import { useSeasonCreateContext } from "./SeasonCreateContext";
import { Link } from "react-router-dom";
import Modal from "../util-components/Modal";
import { useModalsContext } from "../ModalsContext";
import SeasonDeleteModal from "./SeasonDeleteModal";

export default function SeasonsSettings(){
    const { errorMessage, successMessage, modalErrorMessage, modalSuccessMessage, 
            setErrorMessage, setSuccessMessage, setModalErrorMessage, setModalSuccesMessage,
            resetApplicationMessages } = useApplicationContext();
    const {user, isLoggedIn, contextLoading} = useApplicationContext();
    const { openedModal, setOpenedModal, closeModal } = useModalsContext();

    const { seasons, seasonsLoading, retrieveSeasons } = useSeasonCreateContext();

    const [selectedSeason, setSelectedSeason] = useState();

    function openDeleteModal(event, seasonId){
        setSelectedSeason(seasonId);
        setOpenedModal("season-delete");
    }

    useEffect(() => {
        resetApplicationMessages();
        retrieveSeasons();
    }, [])


    if(seasonsLoading || contextLoading){
        return (
            <div className="p-3">Loading...</div>
        )
    }

    if(user.is_admin){
        return(
            <div>                
                <div className="card-header rounded-15-top">
                    <div className="d-flex align-items-center">                        
                        <h3 className="m-0">Seasons editor</h3>

                        <button className="ms-2 btn btn-outline-secondary ms-auto rounded-15" id="season-modal-button" onClick={() => setOpenedModal("season-create")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="grey" className="bi bi-plus" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {seasons.map((season) => (
                    <div className="container my-2" id={`season-${season.year}`} key={`season-${season.year}`}>
                        <div className="p-2 d-flex">
                            <Link className="link-no-decorations" to={`seasons/${season.year}`}>Season {season.year}</Link>
                            <div className="ms-auto dropdown-div" onClick={(e) => toggleDropdown(`dropdown-season-${season.year}`, e)}>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                    </svg>
                                </div>
                                <div id={`dropdown-season-${season.year}`} className="dropdown-menu">
                                    <li><Link className="dropdown-item" to={`seasons/${season.year}`}>Edit</Link></li>
                                    <li><a className="dropdown-item link-button" onClick={(e) => {openDeleteModal(e, season.id)}}>Delete</a></li>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <Modal isOpen={openedModal == "season-create"}>
                    <SeasonCreateModal/>
                </Modal>

                <Modal isOpen={openedModal == "season-delete"}>
                    <SeasonDeleteModal selectedSeason={selectedSeason}/>
                </Modal>

            </div>
        );
    } else {
        return(
            <div>You don't have admin permissions</div>
        );
    }
}