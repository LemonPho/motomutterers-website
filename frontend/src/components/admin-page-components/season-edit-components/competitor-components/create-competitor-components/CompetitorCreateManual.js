import React, { useState } from "react";

import {useApplicationContext} from "../../../../ApplicationContext";
import { useSeasonContext } from "../../SeasonContext";
import { enterKeySubmit, closeDropdowns, autoResizeTextarea } from "../../../../utils";
import { useOpenersContext } from "../../../../OpenersContext";
import Textarea from "../../../../util-components/Textarea";

export default function CreateCompetitorManual(){
    const { closeModal } = useOpenersContext();
    const { createSeasonCompetitor, season } = useSeasonContext()
    const { setModalErrorMessage, modalErrorMessage, resetApplicationMessages } = useApplicationContext();

    const [competitorFirst, setCompetitorFirst] = useState("");
    const [competitorLast, setCompetitorLast] = useState("");
    const [competitorIndependent, setCompetitorIndependent] = useState(false);
    const [competitorRookie, setCompetitorRookie] = useState(false);
    const [competitorNumber, setCompetitorNumber] = useState(1);
    const [competitorPoints, setCompetitorPoints] = useState(0);

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
        } else if(id == "competitor-edit-rookie" || id == "competitor-create-rookie"){
            setCompetitorRookie(event.currentTarget.checked);
        }
    }

    // need to add more error messages, non unique number, etc
    async function createCompetitor(){
        resetApplicationMessages();
        let newCompetitor = {
            first: null,
            last: null,
            number: null,
        };

        let newCompetitorPoints = {
            competitor: newCompetitor,
            points: null,
        }

        let newCompetitorPosition = {
            competitor_points: newCompetitorPoints,
            independent: null,
            rookie: null,
            season: season.year,
        }

        newCompetitor.first = competitorFirst;
        newCompetitor.last = competitorLast;
        newCompetitor.number = competitorNumber;

        newCompetitorPoints.points = competitorPoints;
        newCompetitorPoints.competitor = newCompetitor;

        newCompetitorPosition.independent = competitorIndependent;
        newCompetitorPosition.rookie = competitorRookie;
        newCompetitorPosition.competitor_points = newCompetitorPoints;

        const result = await createSeasonCompetitor(newCompetitorPosition); 

        if(result){
            closeModal();
            retrieveSeason();
        }
    }


    return (
        <div className="custom-modal" id="competitor-create-manual-modal" onClick={(e) => {e.stopPropagation();}}>
            <div className="custom-modal-header justify-content-center">  
                <h5>Create rider</h5>
            </div>
            <hr />
            <div className="custom-modal-body">
                <Textarea id="competitor-create-first" placeholder="First name..." autoFocus value={competitorFirst} setValue={setCompetitorFirst} onEnterFunction={createCompetitor}/>
                <Textarea id="competitor-create-last"placeholder="Last name(s)..." value={competitorLast} setValue={setCompetitorLast} onEnterFunction={createCompetitor}/>
                <div className="d-flex justify-content-around my-2">
                    <input id="competitor-create-number" className="input-field flex-grow-1 me-1" type="number" min="1" max="99" step="1" placeholder="Number" data-category="input-field" onChange={(e) => setCompetitorNumber(e.target.value)} onKeyUp={(e) => enterKeySubmit(e, createCompetitor)}/>
                    <input id="competitor-create-points" className="input-field flex-grow-1" type="number" min="0" max="999" step="1" placeholder="Points" data-category="input-field" onChange={(e) => setCompetitorPoints(e.target.value)} onKeyUp={(e) => enterKeySubmit(e, createCompetitor)}/>
                </div>
                <form className="form-check">
                    <input id="competitor-create-independent" type="checkbox" className="form-check-input" value="" data-category="input-field" onChange={(e) => setCompetitorIndependent(e.target.checked)}/>
                    <label className="form-check-label ms-1" htmlFor="competitor-create-independent">Independent Rider</label>
                </form>
                <form className="form-check">
                    <input id="competitor-create-rookie" type="checkbox" className="form-check-input" value="" data-category="input-field" onChange={(e) => setCompetitorRookie(e.target.checked)}/>
                    <label className="form-check-label ms-1" htmlFor="competitor-create-rookie">Rookie Rider</label>
                </form>
            </div>
            <div className="custom-modal-footer">
                <button id="competitor-create-button" className="btn btn-primary me-auto rounded-15 w-100" onClick={createCompetitor}>Create rider</button>
            </div>
        </div>
    );
}