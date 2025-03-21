import React, { useEffect, useState } from "react";
import { getRaceWeekendAdmin } from "../../../fetch-utils/fetchGet";
import Textarea from "../../../util-components/Textarea";
import { useApplicationContext } from "../../../ApplicationContext";
import { useOpenersContext } from "../../../OpenersContext";
import { useSeasonContext } from "../SeasonContext";
import { useRaceWeekendAdminContext } from "./RaceWeekendAdminContext";

export default function EditRaceWeekendModal(){
    const { closeModal } = useOpenersContext();
    const { editRaceWeekend, selectedRaceWeekend, selectedRaceWeekendLoading } = useRaceWeekendAdminContext();

    const [urlInput, setUrlInput] = useState("");
    const [titleInput, setTitleInput] = useState("");
    const [startInput, setStartInput] = useState("");
    const [endInput, setEndInput] = useState("");

    async function submitEditRaceWeekend(){
        let newRaceWeekend = {
            title: titleInput,
            url: urlInput,
            start: startInput,
            end: endInput,
            id: selectedRaceWeekend.id,
        }

        editRaceWeekend(newRaceWeekend);
    }

    useEffect(() =>{
        if(selectedRaceWeekendLoading){
            return;
        }

        setTitleInput(selectedRaceWeekend.title);
        setUrlInput(selectedRaceWeekend.url);
        setStartInput(selectedRaceWeekend.start);
        setEndInput(selectedRaceWeekend.end);

    }, [selectedRaceWeekend]);

    if(selectedRaceWeekendLoading){
        return(
            <div className="custom-modal">
                <div className="custom-modal-header loading-placeholder">
                    <h5 className="fade-in-out"></h5>
                </div>

                <div className="custom-modal-body d-flex flex-column justify-content-center">
                    <div className="loading-placeholder mb-2">
                        <h5 className="fade-in-out"></h5>
                    </div>
                    <div className="loading-placeholder mb-2">
                        <h5 className="fade-in-out"></h5>
                    </div>
                    <div className="card mb-2 text-center rounded-15">
                        <div className="card-header loading-placeholder">
                            <h5 className="fade-in-out"></h5>
                        </div>
                        <div className="card-body loading-placeholder">
                            <h5 className="fade-in-out"></h5>
                        </div>
                    </div>
                    <div className="card mb-2 text-center rounded-15">
                        <div className="card-header loading-placeholder">
                            <h5 className="fade-in-out"></h5>
                        </div>
                        <div className="card-body loading-placeholder">
                            <h5 className="fade-in-out"></h5>
                        </div>
                    </div>
                </div>

                <div className="custom-modal-footer d-flex flex-column">
                    <button className="btn btn-primary w-100 rounded-15" disabled>Loading...</button>
                    <button className="btn btn-light w-100 rounded-15" disabled>Loading...</button>
                </div>
            </div>
        )
    }

    return(
        <div className="custom-modal">
            <div className="custom-modal-header">
                <h5>{selectedRaceWeekend.title}</h5>
            </div>
            <div className="custom-modal-body">
                <Textarea placeholder={"Title..."} className={"mb-2"} id={'title-input'} value={titleInput} setValue={setTitleInput} onEnterFunction={submitEditRaceWeekend}/>
                <Textarea placeholder={"motorsport url"} className={"mb-2"} id={`url-input`} value={urlInput} setValue={setUrlInput} onEnterFunction={submitEditRaceWeekend}/>
                
                <div className="card mb-2 text-center rounded-15">
                    <div className="card-header">
                        <span>Start date</span>
                    </div>
                    <div className="card-body">
                        <input type="date" className="input-field" onChange={(e) => setStartInput(e.target.value)} defaultValue={startInput}/>
                    </div>
                </div>
                <div className="card mb-2 text-center rounded-15">
                    <div className="card-header">
                        <span>End date</span>
                    </div>
                    <div className="card-body">
                        <input type="date" className="input-field" onChange={(e) => setEndInput(e.target.value)} defaultValue={endInput}/>
                    </div>
                </div>
            </div>
            <div className="custom-modal-footer d-flex flex-column">
                <button className="btn btn-primary rounded-15 w-100 mb-1" onClick={() => submitEditRaceWeekend()}>Submit</button>
                <button className="btn btn-light rounded-15 w-100" onClick={closeModal}>Cancel</button>
            </div>
        </div>
    )
}