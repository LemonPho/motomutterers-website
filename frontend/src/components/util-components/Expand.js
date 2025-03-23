import React, { useEffect, useRef, useState } from "react";

export default function Expand({ children, expanded, id }){
    const divRef = useRef(null);
    const [height, setHeight] = useState("0px");

    useEffect(() => {
        if(!expanded) setHeight("0px");
        if(expanded) setHeight(`${divRef.current.scrollHeight}px`)
    }, [expanded]);

    return (
        <div ref={divRef} className={`expand`} style={{"maxHeight": height}} id={id}>
            {children}
        </div>
    );   
}