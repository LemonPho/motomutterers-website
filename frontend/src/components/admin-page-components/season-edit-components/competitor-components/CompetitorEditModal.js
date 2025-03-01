import React, { useEffect, useRef, useState } from "react";
import { submitDeleteCompetitor } from "../../../fetch-utils/fetchPost";
import { useSeasonContext } from "../SeasonContext";
import { useApplicationContext } from "../../../ApplicationContext";
import { autoResizeTextarea, closeModal, enterKeySubmit } from "../../../utils";
import { useOpenersContext } from "../../../OpenersContext";

export default function CompetitorEditModal({ competitor }){
    const { resetApplicationMessages } = useApplicationContext();
    const { deleteSeasonCompetitor, season, editSeasonCompetitor } = useSeasonContext();
    const { closeModal } = useOpenersContext();

    const [competitorNumber, setCompetitorNumber] = useState(0);
    const [competitorPoints, setCompetitorPoints] = useState(0);
    const [competitorFirst, setCompetitorFirst] = useState("");
    const [competitorLast, setCompetitorLast] = useState("");
    const [competitorIndependent, setCompetitorIndependent] = useState(false);
    const [competitorRookie, setCompetitorRookie] = useState(false);

    const competitorNumberInput = useRef(null);
    const competitorPointsInput = useRef(null);
    const competitorFirstInput = useRef(null);
    const competitorLastInput = useRef(null);
    const competitorIndependentInput = useRef(null);
    const competitorRookieInput = useRef(null);

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
            rookie: null,
        }

        newCompetitor.first = competitorFirst;
        newCompetitor.last = competitorLast;
        newCompetitor.number = competitorNumber;
        newCompetitor.id = competitor.competitor_points.competitor.id;
        newCompetitorPoints.points = competitorPoints;
        newCompetitorPoints.id = competitor.competitor_points.id;
        newCompetitorPosition.id = competitor.id;
        newCompetitorPosition.competitorPoints = newCompetitorPoints;
        newCompetitorPosition.independent = competitorIndependent;
        newCompetitorPosition.rookie = competitorRookie;
        
        const result = await editSeasonCompetitor(newCompetitorPosition);

        if(result){
            closeModal();
        }
    }

    async function deleteCompetitor(){
        resetApplicationMessages();
        const result = await deleteSeasonCompetitor(competitor.competitor_points.competitor.id, season.id);
        if(result){
            closeModal();
        }
    }

    function setCompetitorData(){
        setCompetitorNumber(competitor.competitor_points.competitor.number);
        setCompetitorPoints(competitor.competitor_points.points);
        setCompetitorFirst(competitor.competitor_points.competitor.first);
        setCompetitorLast(competitor.competitor_points.competitor.last);
        setCompetitorIndependent(competitor.independent);
        setCompetitorRookie(competitor.rookie);

        competitorNumberInput.current.value = competitor.competitor_points.competitor.number;
        competitorPointsInput.current.value = competitor.competitor_points.points;
        competitorFirstInput.current.value = competitor.competitor_points.competitor.first;
        competitorLastInput.current.value = competitor.competitor_points.competitor.last;
        competitorIndependentInput.current.value = competitor.independent;
        competitorRookieInput.current.value = competitor.rookie;               
    }

    function handleCompetitorData(event){
        const id = event.currentTarget.id;

        if(id == "competitor-edit-number" || id == "competitor-create-number"){
            setCompetitorNumber(event.currentTarget.value);
        } else if(id == "competitor-edit-points" || id == "competitor-create-points") {
            setCompetitorPoints(event.currentTarget.value);
        } else if(id == "competitor-edit-independent" || id == "competitor-create-independent"){
            setCompetitorIndependent(event.currentTarget.checked);
        } else if(id == "competitor-edit-first" || id == "competitor-create-first"){
            setCompetitorFirst(event.currentTarget.value);
        } else if(id == "competitor-edit-last" || id == "competitor-create-last"){
            setCompetitorLast(event.currentTarget.value);
        } else if(id == "competitor-edit-rookie" || id == "competitor-create-rooie"){
            setCompetitorRookie(event.currentTarget.checked);
        }
    }

    useEffect(() => {
        if(competitor){
            setCompetitorData();
        }
    }, [competitor])

    return(
        <div className="custom-modal" id="competitor-edit-modal" onClick={(e) => {e.stopPropagation();}}>
            <div className="custom-modal-header justify-content-center">  
                <h5>Edit rider</h5>
            </div>
            <hr />
            <div className="custom-modal-body">
                <textarea ref={competitorFirstInput} rows={1} id="competitor-edit-first" className='input-field textarea-expand mt-1 w-100' placeholder="First name..." data-category="input-field" onKeyUp={(e) => enterKeySubmit(e, editCompetitor)} onInput={(e) => handleCompetitorData(e)} onChange={(e) => autoResizeTextarea(e.target)}></textarea>
                <textarea ref={competitorLastInput} rows={1} id="competitor-edit-last" className='input-field textarea-expand mt-1 w-100' placeholder="Last name(s)..." data-category="input-field" onKeyUp={(e) => enterKeySubmit(e, editCompetitor)} onInput={(e) => handleCompetitorData(e)} onChange={(e) => autoResizeTextarea(e.target)}></textarea>
                <div className="d-flex justify-content-around mt-1">
                    <input ref={competitorNumberInput} id="competitor-edit-number" className="input-field flex-grow-1 me-1" type="number" min="1" max="99" step="1" placeholder="Number" value={competitorNumber} data-category="input-field" onChange={(e) => handleCompetitorData(e)} onKeyUp={(e) => enterKeySubmit(e, editCompetitor)}/>
                    <input ref={competitorPointsInput} id="competitor-edit-points" className="input-field flex-grow-1" type="number" min="0" max="999" step="1" placeholder="Points" value={competitorPoints} data-category="input-field" onChange={(e) => handleCompetitorData(e)} onKeyUp={(e) => enterKeySubmit(e, editCompetitor)}/>
                </div>
                <form className="form-check">
                    <input ref={competitorIndependentInput} id="competitor-edit-independent" type="checkbox" className="form-check-input" checked={competitorIndependent} data-category="input-field" onChange={(e) => handleCompetitorData(e)} onKeyUp={(e) => enterKeySubmit(e, editCompetitor)}/>
                    <label className="form-check-label ms-1" htmlFor="competitor-edit-independent">Independent Rider</label>
                </form>

                <form className="form-check">
                    <input ref={competitorRookieInput} id="competitor-edit-rookie" type="checkbox" className="form-check-input" checked={competitorRookie} data-category="input-field" onChange={(e) => handleCompetitorData(e)} onKeyUp={(e) => enterKeySubmit(e, editCompetitor)}/>
                    <label className="form-check-label ms-1" htmlFor="competitor-edit-rookie">Rookie</label>
                </form>
                
            </div>
            <div className="custom-modal-footer d-flex flex-column">
                <button id="competitor-edit-button" className="btn btn-primary rounded-15 w-100" onClick={editCompetitor}>Save Changes</button>
                <button id="competitor-delete-button" className="btn btn-outline-danger mt-2 rounded-15 w-100" onClick={() => deleteCompetitor()}>Delete Rider</button>
            </div>
        </div>
    );
}