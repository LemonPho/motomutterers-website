import React, { useEffect, useRef } from "react";
import { autoResizeTextarea, enterKeySubmit } from "../utils";

export default function Textarea({ id, value, setValue, onEnterFunction, placeholder, className, outline }){
    const textareaRef = useRef(null);

    function keyPress(event){
        setValue(event.target.value);
        autoResizeTextarea(textareaRef.current);
        if(onEnterFunction != undefined){
            enterKeySubmit(event, onEnterFunction);
        }
    }

    useEffect(() => {
        if(value != textareaRef.current.value){
            textareaRef.current.value = value;
        }
    }, [value])

    return(
        <textarea className={`input-field w-100 textarea-expand nested-element-color rounded-15 ${className} ${outline ? "border border-danger" : ""}`} id={id} ref={textareaRef} rows={1} defaultValue={value} placeholder={placeholder} onKeyUp={(e) => {keyPress(e)}}></textarea>
    );
}