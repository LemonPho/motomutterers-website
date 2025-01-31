import React, { useRef, useState } from "react";

import { submitDeleteComment, submitEditAnnouncement, submitEditComment } from "../../fetch-utils/fetchPost";
import { autoResizeTextarea } from "../../utils";
import ProfilePictureLazyLoader from "../ProfilePictureLazyLoader";
import { useApplicationContext } from "../../ApplicationContext";

export default function CommentReply({ reply }){

    const { user, setErrorMessage } = useApplicationContext();

    const [replyEditText, setReplyEditText] = useState("");
    const replyEditTextInput = useRef(null);
    const replyTextDiv = useRef(null);

    async function deleteComment(){
        const commentResponse = await submitDeleteComment(reply.id);

        if(commentResponse.error || commentResponse.status != 201){
            setErrorMessage("There was an error deleting the comment");
            return;
        }
    }

    async function editComment(){
        const commentResponse = await submitEditComment(replyEditText, reply.id);

        if(commentResponse.error || commentResponse.status != 201){
            setErrorMessage("There was an error editing the comment");
            return;
        }

        setReplyEditText("");
        replyEditTextInput.value = "";
    }

    function toggleReplyEditBox(){
        if(replyEditTextInput.current && replyTextDiv){
            replyEditTextInput.current.classList.toggle("hidden");
            replyTextDiv.current.classList.toggle("hidden");
        }
    }

    return(
        <div id={`reply-${reply.id}`} key={`reply-${reply.id}`} className="dynamic-container mb-2" style={{marginLeft: "0px", maxWidth: "calc(100% - 2.7rem)"}}>
            <div className="d-flex align-items-start">
                <ProfilePictureLazyLoader width={"1.5rem"} height={"1.5rem"} username={reply.user.username}/>
                <div className="dynamic-container">
                    <div className="d-flex align-items-center">
                        <a className="link-no-decorations ms-2" href={`/users/${reply.user.username}?page=1`}><small><strong>{reply.user.username}</strong></small></a>
                        <span className="ms-2" style={{fontSize: "0.75rem"}}>{new Date(reply.date_created).toISOString().substring(0,10)} {new Date(reply.date_created).toLocaleTimeString().substring(0,5)}</span>
                        {reply.edited && <small className="ms-1">{`(edited)`}</small>}
                        { 
                        user.id === reply.user.id && 
                            <div className="ms-auto dropdown-div d-flex align-items-start">
                                <button id="reply-dropdown-button" className="btn btn-link link-no-decorations ms-auto" style={{padding: "0"}} onClick={(e) => toggleDropdown(`reply-${reply.id}-dropdown`, e)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                    </svg>
                                </button>
                                <div id={`reply-${reply.id}-dropdown`} className="dropdown-menu">
                                    <li><button className="dropdown-item" onClick={() => toggleReplyEditBox()}>Edit</button></li>
                                    <li><a className="dropdown-item" onClick={() => deleteComment()}>Delete</a></li>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="break-line-text my-1">
                        <span ref={replyTextDiv} id={`reply-${reply.id}-text`} className="">{reply.text}</span>
                        <textarea ref={replyEditTextInput} rows={1} id={`edit-reply-${reply.id}-text`} className="textarea-expand input-field w-100 hidden" defaultValue={reply.text} onChange={(e) => autoResizeTextarea(e.target)} onKeyUp={(e) => setReplyEditText(e.target.value)}></textarea>
                    </div>
                </div>
                
            </div>
            
            {
            user.id === reply.user.id && 
            <div className="d-flex mt-2">
                <button id={`reply-${reply.id}-save-button`} className="btn btn-primary ms-auto me-2 hidden" onClick={() => editComment()}>Save</button>
                <button id={`reply-${reply.id}-cancel-button`} className="btn btn-outline-secondary hidden" onClick={() => toggleReplyEditBox()}>Cancel</button>
            </div>
        } 
        </div>
 
    );
}