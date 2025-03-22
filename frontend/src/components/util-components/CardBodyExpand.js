import React, { useRef } from "react";

export default function CardBodyExpand({ children, expanded, className, maxHeight, id }){
    if(!expanded){
        return(
            <div className={`card-body custom-card-body m-0 p-1`} style={{"maxHeight": `0px`}} id={`${id}`}>
                <div style={{"height": `${maxHeight}`}}>

                </div>
            </div>
        );
    } else {
        return( 
            <div className={`card-body custom-card-body expanded m-0 p-1 ${className}`} style={{"maxHeight": `${maxHeight}`}} id={`${id}`}>
                <div className="d-flex justify-content-center">
                    {children}
                </div>
            </div> 

        );
    }    
}