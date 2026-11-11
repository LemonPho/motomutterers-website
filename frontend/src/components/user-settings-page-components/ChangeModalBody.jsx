import React from "react";
import TextInput from "../util-components/TextInput";
import { useOpenersContext } from "../OpenersContext";

export default function ChangeModalBody({ title, submitFunction, firstFieldPlaceholder, firstFieldValue, firstFieldType, firstFieldInvalid, setFirstFieldValue, secondFieldPlaceholder, secondFieldInvalid, secondFieldValue, secondFieldType, setSecondFieldValue  }){
    const { closeModal } = useOpenersContext();

    return(
        <div className="custom-modal" id="username-modal" onClick={(e) => {e.stopPropagation();}}>
            <div className="custom-modal-header">                                
                <h5>{title}</h5>
            </div>
            <div className="custom-modal-body">
                <TextInput type={firstFieldType} placeholder={firstFieldPlaceholder} className={"mb-2"} value={firstFieldValue} setValue={setFirstFieldValue} onEnterFunction={submitFunction} outline={firstFieldInvalid}/>
                <TextInput type={secondFieldType} placeholder={secondFieldPlaceholder} value={secondFieldValue} setValue={setSecondFieldValue} onEnterFunction={submitFunction} outline={secondFieldInvalid}/>
            </div>
            <div className="custom-modal-footer d-flex flex-column">
                <button id="submit-data" className="btn btn-primary rounded-15 w-100" onClick={(e) => {e.stopPropagation(); submitFunction();}}>Save changes</button>
                <button id="close-change" className="btn btn-outline-danger rounded-15 w-100 mt-2" onClick={() => closeModal()}>Cancel</button>
            </div>
        </div>
    );
}