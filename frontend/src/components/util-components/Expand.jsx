import React, { useEffect, useRef, useState } from "react";

export default function Expand({ children, expanded, id, className, maxHeight }){
    const divRef = useRef(null);
    const [height, setHeight] = useState("0px");

    useEffect(() => {
        if(!expanded) {
            setHeight("0px");
        } else if(expanded && maxHeight != undefined){ 
            setHeight(maxHeight);
        } else if(expanded && maxHeight == undefined){
            setHeight(`${divRef.current.scrollHeight}px`);
        }

    }, [expanded]);

    return (
        <div ref={divRef} className={`expand ${className}`} style={{"maxHeight": height}} id={id}>
            {children}
        </div>
    );   
}