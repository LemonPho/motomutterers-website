import React from "react"
import { closeModals } from "../../../../utils";
import { useSeasonContext } from "../../SeasonContext";
import { submitDeleteAllCompetitors } from "../../../../fetch-utils/fetchPost";
import { useApplicationContext } from "../../../../ApplicationContext";

export default function DeleteAllCompetitorsModal(){
    const { setLoadingMessage, setModalErrorMessage, setSuccessMessage, modalErrorMessage, loadingMessage } = useApplicationContext();
    const { season, retrieveSeason } = useSeasonContext();

    async function deleteAllCompetitors(){
        setLoadingMessage("Loading...");
        const deleteAllCompetitorsResponse = await submitDeleteAllCompetitors(season.id);
        setLoadingMessage(false);

        if(deleteAllCompetitorsResponse.error || deleteAllCompetitorsResponse.status === 500){
            setModalErrorMessage("There was an error deleting all the competitors");
            return;
        }

        if(deleteAllCompetitorsResponse.status === 400){
            setModalErrorMessage("There was an error sending the season data, please reload and try again");
            return;
        }

        if(deleteAllCompetitorsResponse.status === 404){
            setModalErrorMessage("Season was not found, please reload and try again");
            return;
        }

        closeModals();
        setSuccessMessage("Competitors successfully deleted");
        retrieveSeason();
    }

    return(
        <div className="custom-modal hidden" id="delete-all-competitors-modal" onClick={(e) => {e.stopPropagation()}}>
            {modalErrorMessage && <div className="alert alert-danger"><small>{modalErrorMessage}</small></div>}
            {loadingMessage && <div className="alert alert-secondary"><small>{loadingMessage}</small></div>}
            <div className="custom-modal-body justify-content-center">
            <h5><strong>Are you sure you want to delete all the competitors?</strong></h5>
            </div>
            <hr />
            <div className="custom-modal-footer">
                <button className="btn btn-danger rounded-15" onClick={deleteAllCompetitors}>Yes</button>
                <button className="btn btn-secondary rounded-15 ms-auto" onClick={closeModals}>Cancel</button>
            </div>
        </div>
    );
}