import React from "react"
import { toggleModal } from "../../../../utils";
import DeleteAllCompetitorsModal from "./DeleteAllCompetitorsModal";
import SelectCompetitorsToDeleteModal from "./SelectCompetitorsToDelete";

export default function CompetitorDeleteModal(){

    return(
        <div>
            <div className="custom-modal hidden" id="competitor-delete-modal" onClick={(e) => {e.stopPropagation()}}>
                <div className="card rounded-15 clickable mb-2" onClick={(e) => {toggleModal("delete-all-competitors-modal", e)}}>
                    <div className="card-body">
                        <div className="d-flex justify-content-center">
                            <strong>Delete all competitors</strong>
                        </div>
                    </div>
                </div>

                <div className="card rounded-15 clickable" onClick={(e) => {toggleModal("select-competitors-delete-modal", e)}}>
                    <div className="card-body">
                        <div className="d-flex justify-content-center">
                            <strong>Select competitors to delete</strong>
                        </div>
                    </div>
                </div>

                
            </div>
            <DeleteAllCompetitorsModal/>
            <SelectCompetitorsToDeleteModal/>
        </div>
        
    );
}