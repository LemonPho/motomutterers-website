import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { getSeasonCompetitors, getSeasonCompetitor } from "../../../fetch-utils/fetchGet";
import { closeDropdowns, closeModals, enterKeySubmit, toggleModal } from "../../../utils";
import { useSeasonContext } from "../SeasonContext";
import { useApplicationContext } from "../../../ApplicationContext";
import CompetitorCreateModal from "./create-competitor-components/CompetitorCreateModal";
import CompetitorDeleteModal from "./delete-competitor-components/CompetitorDeleteModal";


export default function CompetitorsManagement(){
    const { season, seasonLoading, createSeasonCompetitor, editSeasonCompetitor, deleteSeasonCompetitor, retrieveSeason } = useSeasonContext()    
    const { resetApplicationMessages, modalErrorMessage, setModalErrorMessage, loadingMessage, setLoadingMessage, setSuccessMessage } = useApplicationContext();

    const [tempCompetitor, setTempCompetitor] = useState({});

    const [competitorNumber, setCompetitorNumber] = useState(0);
    const [competitorPoints, setCompetitorPoints] = useState(0);
    const [competitorFirst, setCompetitorFirst] = useState("");
    const [competitorLast, setCompetitorLast] = useState("");
    const [competitorIndependent, setCompetitorIndependent] = useState(false);

    function handleCompetitorData(event){
        const id = event.currentTarget.id;

        if(id == "competitor-edit-number" || id == "competitor-create-number"){
            setCompetitorNumber(event.currentTarget.value);
        } else if(id == "competitor-edit-points" || id == "competitor-create-points") {
            setCompetitorPoints(event.currentTarget.value);
        } else if(id == "competitor-edit-independent" || id == "competitor-create-independent"){
            setCompetitorIndependent(event.currentTarget.checked);
        } else if(id == "competitor-edit-first" || id == "competitor-create-first"){
            setCompetitorFirst(event.currentTarget.innerHTML);
        } else if(id == "competitor-edit-last" || id == "competitor-create-last"){
            setCompetitorLast(event.currentTarget.innerHTML);
        }
    }

    async function openEditModal(competitorId, event){
        resetApplicationMessages();
        toggleModal("competitor-edit-modal", event);
        const competitorResponse = await getSeasonCompetitor(competitorId);

        if(competitorResponse.error){
            setModalErrorMessage("There was an error editing the rider");
            console.log(competitorResponse.error);
            return;
        }

        if(competitorResponse.status == 404){
            setModalErrorMessage("Rider was not found in the database");
            return;
        }

        if(competitorResponse.status != 200){
            setModalErrorMessage("Be sure the rider number is unique to this season");
            return;
        }

        setTempCompetitor(competitorResponse.competitor);
        setCompetitorNumber(competitorResponse.competitor.competitor_points.competitor.number);
        setCompetitorPoints(competitorResponse.competitor.competitor_points.points);
        setCompetitorFirst(competitorResponse.competitor.competitor_points.competitor.first);
        setCompetitorLast(competitorResponse.competitor.competitor_points.competitor.last);
        setCompetitorIndependent(competitorResponse.competitor.independent);
        document.getElementById("competitor-edit-first").innerHTML = competitorResponse.competitor.competitor_points.competitor.first;
        document.getElementById("competitor-edit-last").innerHTML = competitorResponse.competitor.competitor_points.competitor.last;
    }

    async function editCompetitor(){
        resetApplicationMessages();
        let newCompetitor = {
            id: null,
            first: null,
            last: null,
            number: null,
        }
        let newCompetitorPoints = {
            competitor: newCompetitor,
            points: null,
            id: null,
        }
        let newCompetitorPosition = {
            id: null,
            competitorPoints: newCompetitorPoints,
            independent: null,
        }

        newCompetitor.first = competitorFirst;
        newCompetitor.last = competitorLast;
        newCompetitor.number = competitorNumber;
        newCompetitor.id = tempCompetitor.competitor_points.competitor.id;
        newCompetitorPoints.points = competitorPoints;
        newCompetitorPoints.id = tempCompetitor.competitor_points.id;
        newCompetitorPosition.id = tempCompetitor.id;
        newCompetitorPosition.competitorPoints = newCompetitorPoints;
        newCompetitorPosition.independent = competitorIndependent;

        console.log(tempCompetitor);
        console.log(newCompetitorPosition);
        
        const result = await editSeasonCompetitor(newCompetitorPosition);

        if(result){
            closeModals();
        } else {
            setModalErrorMessage("There was an error while submiting the edited competitor");
        }
    }

    async function deleteCompetitor(competitorId){
        resetApplicationMessages();
        const result = await deleteSeasonCompetitor(competitorId, season.id);
        if(result){
            closeModals();
        }
    }


    if(seasonLoading){
        return(<div className="p-3">Loading...</div>)
    }

    return (
        <div>
            <div className="card-header rounded-15-top">
                <div className="container" style={{paddingLeft: "0px", paddingRight: "0px"}}>
                    <div className="d-flex">
                        <h3>Riders</h3>
                        {!season.finalized && 
                        <div className="ms-auto">
                            <button className="btn" id="create-competitor-button" onClick={(e) => toggleModal("competitor-create-modal", e)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="blue" className="bi bi-plus" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                </svg>
                            </button>
                            <button className="btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-trash" viewBox="0 0 16 16" onClick={(e) => toggleModal("competitor-delete-modal", e)}>
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

            <CompetitorCreateModal/>
            <CompetitorDeleteModal/>

            <div className="custom-modal hidden" id="competitor-edit-modal" onClick={(e) => {e.stopPropagation();}}>
                
                <div className="custom-modal-header justify-content-center">  
                    <h5>Edit rider</h5>
                </div>
                {modalErrorMessage && <div className="alert alert-danger"><small>{modalErrorMessage}</small></div>}
                <hr />
                <div className="custom-modal-body">
                    <div id="competitor-edit-first" className='input-field mt-2' contentEditable={true} data-placeholder="First name..." data-category="input-field" onKeyUp={(e) => enterKeySubmit(e, editCompetitor)} onInput={(e) => handleCompetitorData(e)}></div>
                    <div id="competitor-edit-last" className='input-field mt-2' contentEditable={true} data-placeholder="Last name(s)..." data-category="input-field" onKeyUp={(e) => enterKeySubmit(e, editCompetitor)} onInput={(e) => handleCompetitorData(e)}></div>
                    <div className="d-flex justify-content-around mt-2">
                        <input id="competitor-edit-number" className="input-field flex-grow-1 me-1" type="number" min="1" max="99" step="1" placeholder="Number" value={competitorNumber} data-category="input-field" onChange={(e) => handleCompetitorData(e)} onKeyUp={(e) => enterKeySubmit(e, editCompetitor)}/>
                        <input id="competitor-edit-points" className="input-field flex-grow-1" type="number" min="0" max="999" step="1" placeholder="Points" value={competitorPoints} data-category="input-field" onChange={(e) => handleCompetitorData(e)} onKeyUp={(e) => enterKeySubmit(e, editCompetitor)}/>
                    </div>
                    <input id="competitor-edit-independent" type="checkbox" className="form-check-input" checked={competitorIndependent} data-category="input-field" onChange={(e) => handleCompetitorData(e)} onKeyUp={(e) => enterKeySubmit(e, editCompetitor)}/>
                    <label className="form-check-label ms-1" htmlFor="competitor-edit-independent">Independent Rider</label>
                </div>
                <div className="custom-modal-footer">
                    <button id="competitor-edit-button" className="btn btn-primary me-auto rounded-15" onClick={editCompetitor}>Save Changes</button>
                    <button id="competitor-delete-button" className="btn btn-danger ms-auto rounded-15" onClick={() => deleteCompetitor(tempCompetitor.id)}>Delete Rider</button>
                </div>
            </div>
        </div>

        
    )
}