import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { getSeasonCompetitors, getSeasonCompetitor } from "../../../fetch-utils/fetchGet";
import { useSeasonContext } from "../SeasonContext";
import { useApplicationContext } from "../../../ApplicationContext";
import CompetitorCreateModal from "./create-competitor-components/CompetitorCreateModal";
import CompetitorDeleteModal from "./CompetitorDeleteModal";
import CompetitorEditModal from "./CompetitorEditModal";
import Modal from "../../../util-components/Modal";
import { useOpenersContext } from "../../../OpenersContext";
import CompetitorCreateAutomatic from "./create-competitor-components/CompetitorCreateAutomatic";
import CreateCompetitorManual from "./create-competitor-components/CompetitorCreateManual";


export default function CompetitorsManagement(){
    const { openedModal, openModal } = useOpenersContext();
    const { season, seasonLoading, createSeasonCompetitor, editSeasonCompetitor, deleteSeasonCompetitor, retrieveSeason } = useSeasonContext()    
    const { resetApplicationMessages, modalErrorMessage, setModalErrorMessage, loadingMessage, setLoadingMessage, setSuccessMessage, user } = useApplicationContext();

    const [editCompetitor, setEditCompetitor] = useState(null);
    const [resetDeleteModal, setResetDeleteModal] = useState(false);


    async function openEditModal(competitorId, event){
        resetApplicationMessages();
        const competitorResponse = await getSeasonCompetitor(competitorId);

        if(competitorResponse.error){
            setModalErrorMessage("There was an error retrieving the rider");
            console.log(competitorResponse.error);
            return;
        }

        if(competitorResponse.status == 404){
            setModalErrorMessage("Rider was not found in the database");
            return;
        }

        if(competitorResponse.status != 200){
            setModalErrorMessage("There was an error retrieving the rider");
            return;
        }

        setEditCompetitor(competitorResponse.competitor);
        openModal("competitor-edit");
    }

    function openDeleteModal(event){
        setResetDeleteModal(true);
        openModal("competitor-delete");
    }


    if(seasonLoading){
        return(<div className="p-3">Loading...</div>)
    }

    return (
        <div className="card rounded-15 col-md me-2 mb-2 element-background-color element-border-color" style={{padding: "0px"}}>
            <div className="card-header rounded-15-top">
                <div className="container" style={{paddingLeft: "0px", paddingRight: "0px"}}>
                    <div className="d-flex">
                        <h3>Riders</h3>
                        {!season.finalized && 
                        <div className="ms-auto">
                            <button className="btn" id="create-competitor-button" onClick={() => openModal("competitor-create")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="blue" className="bi bi-plus" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                </svg>
                            </button>
                            <button className="btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-trash" viewBox="0 0 16 16" onClick={(e) => openDeleteModal(e)}>
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                </svg>
                            </button>
                        </div>
                        
                        }
                    </div>
                </div>
            </div>
            <div className="card-body" style={{padding: "0.5rem"}}>
                
                <div className="container mb-2">
                {
                season.competitors.length != 0 && 
                    <div className="row">
                        <div className="col-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                        </svg>
                        </div>
                        <span className="col-5">Name</span>
                        <span className="col-3">#</span>
                        <span className="col-3">Points</span>
                    </div>
                }
                {
                    season.competitors.map((competitorPosition) => (
                        <div className="row" key={`competitor-${competitorPosition.id}`}>
                            <div id={`edit-competitor-button`} className="ms-auto dropdown-div col-1 d-flex align-items-center" onClick={(e) => openEditModal(competitorPosition.id, e)}>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                    </svg>
                                </div>
                            </div>
                            <span className="col-5">{competitorPosition.competitor_points.competitor.first} {competitorPosition.competitor_points.competitor.last}</span>                           
                            <span className="col-3">{competitorPosition.competitor_points.competitor.number}</span>                           
                            <span className="col-3">{competitorPosition.competitor_points.points}</span>
                            
                        </div>
                    ))
                }
                </div>
            </div>
            <Modal isOpen={openedModal == "competitor-create-automatic"}>
                <CompetitorCreateAutomatic />
            </Modal>
            <Modal isOpen={openedModal == "competitor-create-manual"}>
                <CreateCompetitorManual />
            </Modal>
            <Modal isOpen={openedModal == "competitor-create"}>
                <CompetitorCreateModal/>
            </Modal>
            <Modal isOpen={openedModal == "competitor-delete"}>
                <CompetitorDeleteModal reset={resetDeleteModal}/>
            </Modal>
            <Modal isOpen={openedModal == "competitor-edit"}>
                <CompetitorEditModal competitor={editCompetitor}/>
            </Modal>
        </div>

        
    )
}