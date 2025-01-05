import React, { useEffect, useState } from "react"
import { closeModals, toggleModal } from "../../../utils";
import { useSeasonContext } from "../SeasonContext";
import { useApplicationContext } from "../../../ApplicationContext";

export default function CompetitorDeleteModal({reset}){
    const { season, seasonLoading } = useSeasonContext();
    const { user, setLoadingMessage, loadingMessage, setErrorMessage, setSuccessMessage } = useApplicationContext();

    const [selectedCompetitors, setSelectedCompetitors] = useState(season.competitors_sorted_number.map((competitor) => ({competitor: competitor, selected: false})));
    const [allCompetitorsSelected, setAllCompetitorsSelected] = useState(false);

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [loading, setLoading] = useState(true);

    function resetVariables(){
        setLoading(true);
        if(seasonLoading){
            return;
        }

        setAllCompetitorsSelected(false);
        setSelectedCompetitors(season.competitors_sorted_number.map((competitor) => ({competitor: competitor, selected: false})));
        setConfirmDelete(false);
        setLoading(false);
    }

    async function deleteCompetitors(){
        if(!confirmDelete){
            setConfirmDelete(true);
            return;
        }

        setLoadingMessage("Loading...");

    }

    function handleSelectCompetitor(index){
        setSelectedCompetitors((selectedCompetitors) => selectedCompetitors.map((element, i) => (i == index ? {competitor: element.competitor, selected: !element.selected} : {competitor: element.competitor, selected: element.selected})));
        setConfirmDelete(false);
    }

    function handleSelectAllCompetitors(){
        setSelectedCompetitors((selectedCompetitors) => selectedCompetitors.map((element) => ({competitor: element.competitor, selected: !allCompetitorsSelected})));
        setAllCompetitorsSelected(!allCompetitorsSelected);
        setConfirmDelete(false);
    }

    useEffect(() => {
        if(reset){
            resetVariables();
        }
    }, [reset]);

    //loading here is used to avoid the checkmarks visibly disappearing while they are being reset
    if(loading){
        return <div className="custom-modal hidden" id="competitor-delete-modal"></div>;
    }

    return(
        <div className="custom-modal hidden" id="competitor-delete-modal" onClick={(e) => {e.stopPropagation();}}>
            <div className="custom-modal-header">
                <h5>Delete Riders</h5>
            </div>

            <div className="custom-modal-body">
                <div id="select-all-competitors-container">
                    <input type="checkbox" className="form-check-input me-2" id="select-all-competitors" checked={allCompetitorsSelected} onChange={() => {handleSelectAllCompetitors()}}/>
                    <label htmlFor="select-all-competitors">Select all riders</label>
                </div>
                {selectedCompetitors.map((competitorSelection, i) => (
                    <div key={`delete-competitor-${competitorSelection.competitor.id}`}>
                        <input type="checkbox" className="form-check-input me-2" data-category="input-field" id={`checkbox-competitor-${competitorSelection.competitor.id}`} checked={competitorSelection.selected} onChange={() => {handleSelectCompetitor(i)}} />
                        <label htmlFor={`checkbox-competitor-${competitorSelection.competitor.id}`}>#{competitorSelection.competitor.competitor_points.competitor.number} {competitorSelection.competitor.competitor_points.competitor.first} {competitorSelection.competitor.competitor_points.competitor.last}</label>
                    </div>
                ))}
            </div>

            <div className="custom-modal-footer d-flex flex-column">
                {loadingMessage ? (
                    <button className="btn btn-danger rounded-15 mb-2" disabled>{`${loadingMessage}`}</button>
                ) : (
                    <button className="btn btn-danger rounded-15 mb-2" onClick={deleteCompetitors}>{confirmDelete ? "Click again to delete" : "Delete"}</button>
                )}
                <button className="btn btn-light rounded-15" onClick={closeModals}>Cancel</button>
            </div>
        </div>
        
    );
}