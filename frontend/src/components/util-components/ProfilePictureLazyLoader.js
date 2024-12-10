import React from "react";

export default function ProfilePictureLazyLoader({ format, base64, width, height }){
    if(!format || !base64){
        return(
            <span className="fading-circle" style={{ width: width, height: height }}></span>
        );
    }

    return(
        <img className="rounded-circle" style={{ width: width, height: height }} src={`data: image/${format}; base64, ${base64}`} alt="" />
    );
}