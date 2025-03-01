import React from "react";

export default function RaceResultModal({ race }){
    if(!race) return null;

    return(
        <div className="custom-modal" id="race-result-modal">
            <div className="custom-modal-header">
                <h5>{race.title}</h5>
            </div>

            <hr />

            <div className="custom-modal-body">
                <div>
                    <div className="row g-0" style={{marginRight: "0px", padding: "0px"}}>
                        <strong className="col-2">Pos.</strong>
                        <strong className="col-6">Name</strong>
                    </div>
                    {race.competitors_positions.map((competitor_position) => (
                        <div className="row g-0" key={`competitor-${competitor_position.competitor_id}`} style={{marginRight: "0px"}}>   
                            {competitor_position.position == 0 && <span className="col-2">DNF</span>}
                            {competitor_position.position != 0 && <span className="col-2">{competitor_position.position}</span>} 
                            <span className="col-6"><small>#{competitor_position.number}</small> {competitor_position.first} {competitor_position.last}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}