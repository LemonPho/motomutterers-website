import React, { useRef } from "react";
import { autoResizeTextarea, enterKeySubmit } from "../utils";

export default function Textarea({ id, value, setValue, onEnterFunction, placeholder, className }){
    const textareaRef = useRef(null);

    function keyPress(event){
        setValue(event.target.value);
        autoResizeTextarea(textareaRef.current);
        if(onEnterFunction != undefined){
            enterKeySubmit(event, onEnterFunction);
        }
    }

    return(
        <textarea className={`input-field w-100 textarea-expand nested-element-color rounded-15 ${className}`} id={id} ref={textareaRef} rows={1} defaultValue={value} placeholder={placeholder} onChange={(e) => {keyPress(e)}}></textarea>
    );
}