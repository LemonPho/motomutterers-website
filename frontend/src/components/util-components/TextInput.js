import React, { useEffect, useRef } from "react";
import { enterKeySubmit } from "../utils";

export default function TextInput({ id, value, setValue, onEnterFunction, placeholder, className, outline, type }){
    const textareaRef = useRef(null);

    function keyPress(event){
        setValue(event.target.value);
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
        <input type={type} className={`input-field w-100 textarea-expand nested-element-color rounded-15 ${className} ${outline ? "border border-danger" : ""}`} id={id} ref={textareaRef} defaultValue={value} placeholder={placeholder} onKeyUp={(e) => {keyPress(e)}}></input>
    );
}