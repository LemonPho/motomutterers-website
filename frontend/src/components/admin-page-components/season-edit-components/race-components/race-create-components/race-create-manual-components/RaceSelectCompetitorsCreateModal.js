import React, { useState, useEffect } from "react";
import { useSeasonContext } from "../../../SeasonContext";
import { useApplicationContext } from "../../../../../ApplicationContext";
import { toggleModal } from "../../../../../utils";
import { useRaceCreateContext } from "../RaceCreateContext";

export default function RaceSelectCompetitorsCreateModal(){
    const [competitors, setCompetitors] = useState([]);

    const { season, seasonLoading } = useSeasonContext();
    const { user, resetApplicationMessages } = useApplicationContext();
    const { setSelectedCompetitors } = useRaceCreateContext();

    function next(e){
        let selectedCompetitors = [];

        for(let i = 0; i < competitors.length; i++){
            if(competitors[i].include){
                selectedCompetitors.push(competitors[i].competitor);
            }
        }

        setSelectedCompetitors(selectedCompetitors);
        resetApplicationMessages();
        toggleModal("race-results-create-manual-modal", e, user.is_logged_in, user.is_admin, false);
    }

    function handleCompetitorIncludeChange(index){
        setCompetitors((prevCompetitors) => 
            prevCompetitors.map((prevCompetitor, i) => (i == index ? {...prevCompetitor, include : !prevCompetitor.include} : prevCompetitor))
        );
    }

    useEffect(() => {
        if(seasonLoading){
            return;
        }

        const tempCompetitors = season.competitors_sorted_number.map(competitor => ({
            competitor: competitor,
            include: true,
        }));
    
        setCompetitors(tempCompetitors);
    }, [seasonLoading]);


    return (
        <div className="custom-modal hidden" id="competitors-select-modal" onClick={(e) => {e.stopPropagation();}}>
            <div className="custom-modal-header justify-content-center">
                <h5>Select the riders that participated in the race</h5>
            </div>
            <hr />
            <div className="custom-modal-body">
                {(competitors.length != 0) && 
                    competitors.map((competitorIndex, i) => (
                        <div className="form-check" key={`competitor-checkbox-${competitorIndex.competitor.id}`} id={`competitor-checkbox-${competitorIndex.competitor.id}`}>
                            <input className="form-check-input" data-category="input-field" type="checkbox" checked={competitors[i].include} onChange={() => {handleCompetitorIncludeChange(i)}} id={`include-competitor-${competitorIndex.competitor.competitor_points.competitor.id}`}/>
                            <label className="form-check-label" htmlFor={`include-competitor-${competitorIndex.competitor.competitor_points.competitor.id}`}>#{competitorIndex.competitor.competitor_points.competitor.number} {competitorIndex.competitor.competitor_points.competitor.first} {competitorIndex.competitor.competitor_points.competitor.last}</label>
                        </div>
                    ))
                }
            </div>
            <div className="custom-modal-footer mt-2">
                <button className="btn btn-primary rounded-15" onClick={(e) => {toggleModal("create-race-details-manual-modal", e, user.is_logged_in, user.is_admin, false)}}>Back</button>
                <button className="btn btn-primary ms-auto rounded-15" onClick={(e) => {next(e)}}>Next</button>
            </div>
        </div>
    );
}