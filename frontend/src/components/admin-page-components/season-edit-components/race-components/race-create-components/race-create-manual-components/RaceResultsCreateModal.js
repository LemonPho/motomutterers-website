import React, { useState, useEffect } from "react";
import { useSeasonContext } from "../../../SeasonContext";
import { useApplicationContext } from "../../../../../ApplicationContext";
import { useRaceCreateContext } from "../RaceCreateContext";
import { useOpenersContext } from "../../../../../OpenersContext";

export default function RaceResultsCreateModal(){
    const { openModal } = useOpenersContext();
    const { season, seasonLoading } = useSeasonContext();
    const { user, resetApplicationMessages, setLoadingMessage } = useApplicationContext();
    const { createRace, invalidCompetitors, selectedCompetitors, competitorsPositions, setCompetitorsPositions } = useRaceCreateContext();

    const [competitors, setCompetitors] = useState([]);
    const [loading, setLoading] = useState(true);

    function loadSelectedCompetitors(){
        setCompetitors(selectedCompetitors);

        const newCompetitorsPositions = selectedCompetitors.map((competitor) => {
            let newCompetitorPosition = {
                competitor_id: competitor.competitor_points.competitor.id,
                position: 0,
            }

            return newCompetitorPosition
        });

        setCompetitorsPositions(newCompetitorsPositions);
    }

    function handleCompetitorPositionChange(e, i){
        let tempCompetitorsPositions = competitorsPositions;

        tempCompetitorsPositions[i].position = Number(e.currentTarget.value);

        setCompetitorsPositions(tempCompetitorsPositions);
    }

    async function handleCreateRace(){
        resetApplicationMessages();
        let sortedCompetitorsPositions = competitorsPositions;
        sortedCompetitorsPositions.sort((a, b) => {
            return a.position - b.position;
        });
        setCompetitorsPositions(sortedCompetitorsPositions);
        
        await createRace();
    }

    useEffect(() => {
        setLoading(true);
        loadSelectedCompetitors();
        setLoading(false);
    }, [selectedCompetitors])

    if(seasonLoading || loading){
        return;
    }

    return (
        <div className="custom-modal" id="race-results-create-manual-modal" onClick={(e) => {e.stopPropagation()}}>
            <div className="custom-modal-header justify-content-center">
                <h5>Race Create Manual</h5>
            </div>
            <div className="alert alert-info"><small>Input the final positions of the riders, 0 for DNF</small></div>
            <hr />

            <div className="custom-modal-body">
                {competitors.length != 0 && 
                    competitors.map((competitor, i) => (
                        <div key={`competitor-position-form-${competitor.competitor_points.competitor.number}`} className="mb-1">
                            {invalidCompetitors.length != 0 ? 
                            (
                                invalidCompetitors.some((element) => element == competitor.competitor.id ) ? 
                                (
                                    <form>
                                        <input className="input-field me-2" data-category="input-field" id={`competitor-position-${competitor.competitor_points.competitor.number}`} type="number" max={99} min={0} defaultValue={0} onChange={(e) => handleCompetitorPositionChange(e, i)}/>
                                        <label className="text-danger" htmlFor={`competitor-position-${competitor.competitor_points.competitor.number}`}>#{competitor.competitor_points.competitor.number} {competitor.competitor_points.competitor.first} {competitor.competitor_points.competitor.last}</label>
                                    </form>
                                )
                                :
                                (
                                    <form >
                                        <input className="input-field me-2" data-category="input-field" id={`competitor-position-${competitor.competitor_points.competitor.number}`} type="number" max={99} min={0} defaultValue={0} onChange={(e) => handleCompetitorPositionChange(e, i)}/>
                                        <label htmlFor={`competitor-position-${competitor.competitor_points.competitor.number}`}>#{competitor.competitor_points.competitor.number} {competitor.competitor_points.competitor.first} {competitor.competitor_points.competitor.last}</label>
                                    </form>
                                ) 
                                
                            )
                            :
                            (
                                <form>
                                    <input className="input-field me-2" data-category="input-field" id={`competitor-position-${competitor.competitor_points.competitor.number}`} type="number" max={99} min={0} defaultValue={0} onChange={(e) => handleCompetitorPositionChange(e, i)}/>
                                    <label htmlFor={`competitor-position-${competitor.competitor_points.competitor.number}`}>#{competitor.competitor_points.competitor.number} {competitor.competitor_points.competitor.first} {competitor.competitor_points.competitor.last}</label>
                                </form>
                            )}
                        </div>
                    ))
                }
            </div>

            <div className="custom-modal-footer">
                <button className="btn btn-primary rounded-15" onClick={(e) => {openModal("race-create-select-competitors")}}>Back</button>
                <button className="btn btn-primary rounded-15 ms-auto" onClick={handleCreateRace}>Save race result</button>
            </div>
        </div>
    )
}