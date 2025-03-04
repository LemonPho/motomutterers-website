import React, { useState, useEffect } from "react";
import { useSeasonContext } from "../SeasonContext";
import { useApplicationContext } from "../../../ApplicationContext";
import { submitToggleSeasonFinalize } from "../../../fetch-utils/fetchPost";
import Modal from "../../../util-components/Modal";
import SeasonFinalizeModal from "./SeasonFinalizeModal";
import { useOpenersContext } from "../../../OpenersContext";

export default function SeasonFinalize() {
    const { openedModal, openModal } = useOpenersContext();
    const { season } = useSeasonContext();
    const { setErrorMessage, setSuccessMessage, selectPicksState, contextLoading } = useApplicationContext();
    const [ seasonFinalizeState, setSeasonFinalizeState ] = useState(season.finalized); 

    return (
        <div className="d-flex align-items-center w-100 ps-1">
            <strong>Finalize season</strong>
            {console.log(seasonFinalizeState)}
            {(seasonFinalizeState || !season.current) && 
            <button type="button" className="btn btn-outline-danger ms-auto rounded-15" disabled={true} onClick={() => setErrorMessage("Season is already finalized")}>Season finalized</button>
            }
            {(!seasonFinalizeState && season.current) && 
            <button className="btn btn-outline-danger ms-auto rounded-15" onClick={(e) => {openModal("season-finalize")}}>Finalize season</button>
            }
            <Modal isOpen={openedModal == "season-finalize"}>
                <SeasonFinalizeModal/>
            </Modal>
        </div>
    );
}