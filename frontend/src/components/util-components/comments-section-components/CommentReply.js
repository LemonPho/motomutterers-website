import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

import { autoResizeTextarea } from "../../utils";
import ProfilePictureLazyLoader from "../ProfilePictureLazyLoader";
import { useApplicationContext } from "../../ApplicationContext";
import { useCommentsContext } from "./CommentsSectionContext";
import Dropdown from "../Dropdown";
import { useOpenersContext } from "../../OpenersContext";

export default function CommentReply({ reply }){

    const { postEditComment, postDeleteComment } = useCommentsContext();
    const { user, setErrorMessage } = useApplicationContext();
    const { openedDropdown, toggleDropdown, closeDropdown } = useOpenersContext();

    const [replyEditText, setReplyEditText] = useState("");
    const replyEditTextDiv = useRef(null);
    const replyEditTextInput = useRef(null);
    const replyTextDiv = useRef(null);

    async function deleteComment(){
        await postDeleteComment(reply.id);
    }

    async function editComment(){
        if(replyEditText == ""){
            return;
        }

        const commentResponse = await postEditComment(replyEditText, reply.id);

        if(commentResponse){
            replyTextDiv.current.innerHTML = replyEditText;
            setReplyEditText("");
            replyEditTextInput.value = "";
            toggleReplyEditBox();
            closeDropdown();
        }
        
    }

    function toggleReplyEditBox(){
        if(replyEditTextDiv.current && replyTextDiv.current){
            setReplyEditText("");
            replyTextDiv.current.classList.toggle("hidden");
            replyEditTextDiv.current.classList.toggle("hidden")
        }
    }

    return(
        <div id={`reply-${reply.id}`} key={`reply-${reply.id}`} className="dynamic-container mb-2" style={{marginLeft: "0px", maxWidth: "calc(100% - 2.7rem)"}}>
            <div className="d-flex align-items-start">
                <ProfilePictureLazyLoader width={"1.5rem"} height={"1.5rem"} username={reply.user.username}/>
                <div className="dynamic-container">
                    <div className="d-flex align-items-center">
                        <Link className="link-no-decorations ms-2" to={`/users/${reply.user.username}?page=1`}><small><strong>{reply.user.username}</strong></small></Link>
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
                                <Dropdown isOpen={openedDropdown == `reply-${reply.id}-dropdown`}>
                                    <div id={`reply-${reply.id}-dropdown`} className="dropdown-menu">
                                        {(user.id == reply.user.id) && <li><button className="dropdown-item" onClick={() => toggleReplyEditBox()}>Edit</button></li>}
                                        <li><button className="dropdown-item" onClick={() => deleteComment()}>Delete</button></li>
                                    </div>
                                </Dropdown>
                            </div>
                        }
                    </div>
                    <div className="break-line-text my-1">
                        <span ref={replyTextDiv} id={`reply-${reply.id}-text`} className="">{reply.text}</span>
                        <div ref={replyEditTextDiv} className="hidden">
                            <textarea ref={replyEditTextInput} rows={1} id={`edit-reply-${reply.id}-text`} className="textarea-expand input-field w-100" defaultValue={reply.text} onChange={(e) => autoResizeTextarea(e.target)} onKeyUp={(e) => setReplyEditText(e.target.value)}></textarea>
                            <div className="d-flex mt-2">
                                <button id={`reply-${reply.id}-save-button`} className="btn btn-primary ms-auto me-2" onClick={() => editComment()}>Save</button>
                                <button id={`reply-${reply.id}-cancel-button`} className="btn btn-outline-secondary" onClick={() => toggleReplyEditBox()}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
 
    );
}