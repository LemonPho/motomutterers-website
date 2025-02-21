import React, { useEffect, useState } from "react";
import { useSeasonContext } from "../SeasonContext";
import { useApplicationContext } from "../../../ApplicationContext";
import { useNavigate } from "react-router-dom";
import { useModalsContext } from "../../../ModalsContext";
import Modal from "../../../util-components/Modal";
import DeleteSeasonModal from "./DeleteSeasonModal";

export default function DeleteSeason(){
    const { closeModal, setOpenedModal, openedModal } = useModalsContext();

    return(
        <>
            <div className="d-flex align-items-center w-100 ps-1">
                <strong>Delete season</strong>
                <div className="ms-auto">
                    <button className="btn btn-outline-danger rounded-15" onClick={(e) => {setOpenedModal("season-delete")}}>
                        Delete season
                    </button>
                </div>
            </div>
            <Modal isOpen={openedModal == "season-delete"}>
                <DeleteSeasonModal/>
            </Modal>
        </>    
    );
}