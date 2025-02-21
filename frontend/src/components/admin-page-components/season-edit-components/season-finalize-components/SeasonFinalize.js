import React, { useState, useEffect } from "react";
import { useSeasonContext } from "../SeasonContext";
import { useApplicationContext } from "../../../ApplicationContext";
import { submitToggleSeasonFinalize } from "../../../fetch-utils/fetchPost";
import Modal from "../../../util-components/Modal";
import SeasonFinalizeModal from "./SeasonFinalizeModal";
import { useModalsContext } from "../../../ModalsContext";

export default function SeasonFinalize() {
    const { openedModal, setOpenedModal } = useModalsContext();
    const { season } = useSeasonContext();
    const { setErrorMessage, setSuccessMessage, selectPicksState, contextLoading } = useApplicationContext();
    const [ seasonFinalizeState, setSeasonFinalizeState ] = useState(season.finalized); 

    return (
        <div className="d-flex align-items-center w-100 ps-1">
            <strong>Finalize season</strong>
            {seasonFinalizeState || !season.current && 
            <div className="form-check form-switch ms-auto mb-0" onClick={(e) => {e.stopPropagation();setErrorMessage("You need to set this season as the current season to enable picks or finalize")}}>
                <input className="form-check-input" type="checkbox" checked={seasonFinalizeState} disabled/>
            </div>
            }
            {!seasonFinalizeState && season.current && 
            <div className="form-check form-switch ms-auto mb-0">
                <input className="form-check-input" type="checkbox" checked={seasonFinalizeState} onChange={(e) => {setOpenedModal("season-finalize")}}/>
            </div>
            }
            <Modal isOpen={openedModal == "season-finalize"}>
                <SeasonFinalizeModal/>
            </Modal>
        </div>
    );
}