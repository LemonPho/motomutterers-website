import React, { useState } from "react";
import Textarea from "../../../util-components/Textarea";
import { useSeasonContext } from "../SeasonContext";
import { useRaceWeekendAdminContext } from "./RaceWeekendAdminContext";

export default function CreateRaceWeekendModal(){
    const { season } = useSeasonContext();
    const { postRaceWeekend } = useRaceWeekendAdminContext();

    const [urlInput, setUrlInput] = useState("");
    const [titleInput, setTitleInput] = useState("");
    const [startInput, setStartInput] = useState(new Date());
    const [endInput, setEndInput] = useState(new Date());

    async function createRaceWeekend(){
        let newRaceWeekend = {
            title: titleInput,
            url: urlInput,
            start: startInput,
            end: endInput,
            seasonYear: season.year
        }

        postRaceWeekend(newRaceWeekend);
    }

    return(
        <div className="custom-modal" id="race-weekend-create-modal">
            <div className="custom-modal-header d-flex justify-content-center">
                <h5>Create Race Weekend</h5>
            </div>

            <div className="custom-modal-body">
                <Textarea value={titleInput} setValue={setTitleInput} placeholder={"Input the race weekend title..."} className={"mb-2"}/>
                <Textarea value={urlInput} setValue={setUrlInput} placeholder={"Input motorsport url..."} className={"mb-2"}/>
                <div className="card mb-2 text-center rounded-15">
                    <div className="card-header">
                        <span>Start date</span>
                    </div>
                    <div className="card-body">
                        <input type="date" className="input-field" onChange={(e) => setStartInput(e.target.value)} />
                    </div>
                </div>
                <div className="card mb-2 text-center rounded-15">
                    <div className="card-header">
                        <span>End date</span>
                    </div>
                    <div className="card-body">
                        <input type="date" className="input-field" onChange={(e) => setEndInput(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="custom-modal-footer d-flex justify-content-center">
                <button className="btn btn-primary rounded-15 w-100" onClick={createRaceWeekend}>Submit</button>
            </div>
        </div>
    )
}