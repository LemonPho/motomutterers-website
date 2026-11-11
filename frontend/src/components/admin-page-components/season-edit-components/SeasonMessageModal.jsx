import React from "react";

export default function SeasonMessageModal({ seasonMessage, closeModal, deleteSeasonMessage }){
    return(
        <div className="custom-modal">
            <div className="custom-modal-header">
                <h5>Season message</h5>
            </div>
            <div className="custom-modal-body">
                {seasonMessage.message}
            </div>
            <div className="custom-modal-footer">
                <button className="btn btn-outline-danger w-100 rounded-15" onClick={() => {closeModal();deleteSeasonMessage(seasonMessage.id)}}>Delete message</button>
            </div>
        </div>
    );
}