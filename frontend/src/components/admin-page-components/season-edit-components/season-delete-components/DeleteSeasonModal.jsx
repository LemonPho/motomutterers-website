import React, { useState } from "react";
import { useSeasonContext } from "../SeasonContext";
import { useOpenersContext } from "../../../OpenersContext";
import { useApplicationContext } from "../../../ApplicationContext";
import { useNavigate } from "react-router-dom";
import TextInput from "../../../util-components/TextInput";

export default function DeleteSeasonModal(){
    const { setErrorMessage, resetApplicationMessages } = useApplicationContext();
    const { closeModal } = useOpenersContext();
    const { season, deleteSeason } = useSeasonContext();

    const navigate = useNavigate();

    const [yearInput, setYearInput] = useState("");
    const [yearInvalid, setYearInvalid] = useState(false);

    async function deleteSeasonConfirm(){
        resetApplicationMessages();
        setYearInvalid(false);
        if(yearInput != season.year){
            setYearInvalid(true);
            setErrorMessage("The season year is not correct");
            return;
        }

        await deleteSeason();
        closeModal();
        navigate("/administration");
    }

    return(
        <div className="custom-modal" id="season-delete-modal" onClick={(e) => {e.stopPropagation();}}>
            <div className="custom-modal-header justify-content-center">
                <h5>Delete Season</h5>
            </div>
            <div className="custom-modal-body">
                <TextInput type="text" placeholder="Write the season year" value={yearInput} setValue={setYearInput} onEnterFunction={deleteSeasonConfirm} outline={yearInvalid}/>
            </div>
            <div className="custom-modal-footer d-flex flex-column">
                <button className="btn btn-danger w-100 rounded-15" onClick={deleteSeasonConfirm}>Delete Season</button>
                <button className="btn btn-light w-100 rounded-15 mt-2" onClick={() => closeModal()}>Cancel</button>
            </div>
        </div>
    )
}