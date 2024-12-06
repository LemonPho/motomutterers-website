import React from "react";

import { closeDropdowns, closeModals, enterKeySubmit, toggleDropdown, toggleModal } from "../../../../utils.js";
import { useApplicationContext } from "../../../../ApplicationContext.js";

import CreateCompetitorManual from "./CompetitorCreateManual.js";
import CompetitorCreateAutomatic from "./CompetitorCreateAutomatic.js";

export default function CompetitorCreate(){
    const { modalErrorMessage, setModalErrorMessage, resetApplicationMessages } = useApplicationContext();

    return (
        <div className="ms-auto">
            <div className="custom-modal hidden" id="competitor-create-modal" onClick={(e) => {e.stopPropagation()}}>
                <div className="custom-modal-header justify-content-center">
                    <h5>Create Rider</h5>
                    
                </div>
                
                <div className="custom-modal-body">
                    {modalErrorMessage && <div className="alert alert-danger"><small>{modalErrorMessage}</small></div>}
                    <div className="card rounded-15 clickable mb-2" onClick={(e) => {resetApplicationMessages();toggleModal("competitor-create-automatic-modal", e)}}>
                        <div className="card-body">
                            <div className="d-flex justify-content-center">
                                <strong>Retrieve season competitors through motogp standings page</strong>
                            </div>
                        </div>
                    </div>
                    <div className="card rounded-15 clickable" onClick={(e) => {resetApplicationMessages();toggleModal("competitor-create-manual-modal", e)}}>
                        <div className="card-body">
                            <div className="d-flex justify-content-center">
                                <strong>Create competitor manually</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CompetitorCreateAutomatic />

            <CreateCompetitorManual />
            
        </div>
    )
}