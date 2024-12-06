import React, { useState, useEffect, useContext } from "react";

import ApplicationContext, { useApplicationContext } from "../ApplicationContext";
import { getCompetitors, getSeasons } from "../fetch-utils/fetchGet";
import { submitCurrentSeason, submitDeleteSeason, submitSeason } from "../fetch-utils/fetchPost";
import { closeDropdowns, closeModals, enterKeySubmit, toggleDropdown, toggleModal } from "../utils";

export default function SeasonsSettings(){
    const currentYear = new Date().getFullYear();

    const { errorMessage, successMessage, modalErrorMessage, modalSuccessMessage, 
            setErrorMessage, setSuccessMessage, setModalErrorMessage, setModalSuccesMessage,
            resetApplicationMessages } = useApplicationContext();
    const {user, isLoggedIn, contextLoading} = useApplicationContext();

    const [selectedSeason, setSelectedSeason] = useState();
    const [seasons, setSeasons] = useState([]);
    const [seasonsLoading, setSeasonsLoading] = useState(true);
    const [seasonYearCreation, setSeasonYearCreation] = useState(currentYear);

    async function retrieveSeasons(){
        let seasonsResponse = await getSeasons();

        if(seasonsResponse.error){
            console.log(seasonsResponse.error);
            setErrorMessage("There was an error loading the seasons");
            return;
        }

        setSeasons(seasonsResponse.seasons);
        setSeasonsLoading(false);
    }

    function handleYearChange(event){
        const year = event.target.value;
        setSeasonYearCreation(year);
    }

    function openDeleteModal(event, seasonId){
        setSelectedSeason(seasonId);
        toggleModal("season-delete-modal", event, isLoggedIn);
    }

    async function setCurrentSeason(year){
        let currentSeasonResponse = await submitCurrentSeason(year);

        if(currentSeasonResponse.error){
            console.log(currentSeasonResponse.error);
            setErrorMessage("There was an error submiting the current season");
            return;
        }

        retrieveSeasons();
    }

    async function postSeason(){
        resetApplicationMessages();
        let seasonResponse = await submitSeason(seasonYearCreation);

        if(seasonResponse.error){
            console.log(error);
            setModalErrorMessage("There was an error creating the season");
            return;
        }

        if(seasonResponse.status !== 200){
            setModalErrorMessage("Be sure the year of the season is unique");
            return;
        }

        setSuccessMessage("Season created");
        closeModals();
        setSeasonYearCreation(currentYear);
        retrieveSeasons();
    }

    async function deleteSeason(event){
        resetApplicationMessages();
        event.stopPropagation();

        let deleteResponse = await submitDeleteSeason(selectedSeason);

        if(deleteResponse.error){
            setModalErrorMessage("There was an error deleting the season");
            return;
        }

        if(deleteResponse.status == 200){
            closeModals();
            retrieveSeasons();
            setSuccessMessage("Season deleted");
        }

        
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

                        {seasons.length > 0 && (
                            <div className="dropdown ms-auto">
                                <button className="btn btn-outline-secondary dropdown-toggle" type="button" onClick={(e) => toggleDropdown("season-selector-dropdown", e, undefined)}>
                                    Current Season
                                </button>
                                <ul className="dropdown-menu" id="season-selector-dropdown">
                                    {seasons.map((season) => (
                                        <li className="ms-2" key={`${season.year}`}>
                                            <a className="link-button d-flex align-items-center" id={`${season.year}`} onClick={() => {setCurrentSeason(season.year)}}>
                                                {season.year}
                                                {season.current && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ms-auto me-1 bi bi-check" viewBox="0 0 16 16">
                                                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                                                    </svg>
                                                )}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button className="ms-2 btn btn-outline-secondary ms-auto" id="season-modal-button" onClick={(e) => toggleModal("season-create-modal", e, isLoggedIn, user.is_admin)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="grey" className="bi bi-plus" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="custom-modal hidden" id="season-create-modal" onClick={(e) => {e.stopPropagation();}}>
                    {modalErrorMessage != "" && <div className="alert alert-danger my-2"><small>{modalErrorMessage}</small></div>}
                    {modalSuccessMessage != "" && <div className="alert alert-success my-2"><small>{modalSuccessMessage}</small></div>}
                    <div className="custom-modal-header justify-content-center">  
                        <h5>Create season</h5>
                    </div>   
                    <div className="custom-modal-body">
                        <hr />
                        <div className="d-flex justify-content-center w-100">
                            <input className="input-field" type="number" min="1900" max="2099" step="1" value={seasonYearCreation} onChange={(e) => handleYearChange(e)} id="season-year" onKeyUp={(e) => enterKeySubmit(e, postSeason)} />
                        </div>
                    </div>
                    <div className="custom-modal-footer">
                        <button id="submit-data" className="btn btn-primary me-auto rounded-15" onClick={postSeason}>Create season</button>
                    </div>
                </div>

                <div className="custom-modal hidden" id="season-delete-modal" onClick={(e) => {e.stopPropagation();}}>
                    {modalErrorMessage != "" && <div className="alert alert-danger my-2"><small>{modalErrorMessage}</small></div>}
                    {modalSuccessMessage != "" && <div className="alert alert-success my-2"><small>{modalSuccessMessage}</small></div>}
                    <div className="custom-modal-header justify-content-center">  
                        <h5>Are you sure you want to delete this season?</h5>
                    </div>   
                    <div className="custom-modal-body">
                        <hr />
                    </div>
                    <div className="custom-modal-footer">
                        <button id="season-confirm-delete" className="btn btn-danger me-auto rounded-15" onClick={(e) => deleteSeason(e)}>Confirm</button>
                        <button id="season-cancel-delete" className="btn btn-secondary ms-auto rounded-15" onClick={closeModals}>Cancel</button>
                    </div>
                </div>
                
                {seasons.map((season) => (
                    <div className="container my-2" id={`season-${season.year}`} key={`season-${season.year}`}>
                        <div className="p-2 d-flex">
                            <a className="link-no-decorations" href={`administration/seasons/${season.year}`}>Season {season.year}</a>
                            <div className="ms-auto dropdown-div" onClick={(e) => toggleDropdown(`dropdown-season-${season.year}`, e)}>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                    </svg>
                                </div>
                                <div id={`dropdown-season-${season.year}`} className="dropdown-menu">
                                    <li><a className="dropdown-item" href={`administration/seasons/${season.year}`}>Edit</a></li>
                                    <li><a className="dropdown-item link-button" onClick={(e) => {openDeleteModal(e, season.id)}}>Delete</a></li>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        );
    } else {
        return(
            <div>You don't have admin permissions</div>
        );
    }
}