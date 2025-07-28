import React from "react";
import { useRaceWeekendContext } from "./RaceWeekendsContext";
import { useOpenersContext } from "../OpenersContext";
import Dropdown from "../util-components/Dropdown";
import { Link } from "react-router-dom";
import RaceWeekendCard from "./RaceWeekendCard";

export default function RaceWeekends(){
    const { openedDropdown, toggleDropdown, closeDropdown } = useOpenersContext();
    const { raceWeekends, raceWeekendsLoading, selectedSeason, seasonList, seasonListLoading } = useRaceWeekendContext();

    

    return(
        <div className="card rounded-15 element-background-color element-border-color p-2">
            <div className="card-header d-flex align-items-center rounded-15 nested-element-color mb-3">
                <h4>Race weekends</h4>
                <div className="dropdown-div ms-auto">
                    <button className="btn btn-outline-secondary dropdown-toggle rounded-15" type="button" onClick={(e) => toggleDropdown("season-selector-dropdown", e, undefined)}>
                        {selectedSeason}
                    </button>
                    <Dropdown isOpen={openedDropdown == "season-selector-dropdown"}>
                        <ul className="dropdown-menu" id="season-selector-dropdown" style={{top: "100%", right: "0px"}}>
                            {!seasonListLoading && (seasonList.map((season) => (
                                <li className="ms-2" key={`${season.year}`}>
                                    <Link className="d-flex align-items-center link-no-decorations" onClick={closeDropdown} to={`/race-weekends?season=${season.year}`} id={`${season.year}`}>
                                        {season.year}
                                        {season.year == selectedSeason && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ms-auto me-1 bi bi-check" viewBox="0 0 16 16">
                                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                                            </svg>
                                        )}
                                    </Link>
                                </li>
                            )))}
                        </ul>
                    </Dropdown>
                </div>
            </div>
            <div className="card-body p-0">
                {(!raceWeekendsLoading && raceWeekends != undefined && raceWeekends.length == 0) && (
                <h5 className="rounded-15 nested-element-color p-2">No race results have been added for this season.</h5>
                )}
        
                {(!raceWeekendsLoading && raceWeekends != undefined) && (raceWeekends.map((raceWeekend) => (
                <div key={raceWeekend.id} className="mb-2 p-2 clickable rounded-15 nested-element-color">
                    <RaceWeekendCard raceWeekend={raceWeekend} loading={raceWeekendsLoading}/>
                </div>
                )))}
            </div>
        </div>
    )
}