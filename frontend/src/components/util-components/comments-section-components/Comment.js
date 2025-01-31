import React, { useRef, useState } from "react";

import { submitComment, submitDeleteComment, submitEditComment } from "../../fetch-utils/fetchPost";
import { useApplicationContext } from "../../ApplicationContext";
import ProfilePictureLazyLoader from "../ProfilePictureLazyLoader";
import { autoResizeTextarea, focusDiv, toggleDropdown } from "../../utils";
import CommentReply from "./CommentReply";
import { useAnnouncementContext } from "../../announcement-page-components/AnnouncementContext";

export default function Comment({ comment, parentElement }){
    const { user, setErrorMessage } = useApplicationContext();
    const { retrieveAnnouncement } = useAnnouncementContext();

    const [replyCreateText, setReplyCreateText] = useState("");
    const replyCreateTextInput = useRef(null);
    const replyCreateInputDiv = useRef(null);

    const commentRepliesDiv = useRef(null);

    async function deleteComment(commentId){
        const commentResponse = await submitDeleteComment(commentId);

        if(commentResponse.error || commentResponse.status != 201){
            setErrorMessage("There was an error deleting the comment");
            return;
        }

        retrieveAnnouncement();
    }

    async function postCommentReply(){
        const commentResponse = await submitComment(replyCreateText, parentElement, comment.id);

        if(commentResponse.error || commentResponse.status != 201){
            setErrorMessage("There was an error submiting the comment");
            return;
        }

        setReplyCreateText("");
        replyCreateTextInput.current.value = "";

        retrieveAnnouncement();
    }

    function toggleRepliesDiv(){
        if(commentRepliesDiv.current){
            commentRepliesDiv.current.classList.toggle("hidden");
        }
    }

    function toggleReplyCreateBox(){
        if(replyCreateInputDiv.current)
            replyCreateInputDiv.current.classList.toggle("hidden");
    }

    return(
        <div id={`comment-${comment.id}`} key={`comment-${comment.id}`}>
            <div className="d-flex align-items-start">
                <ProfilePictureLazyLoader width={"2.5rem"} height={"2.5rem"} username={comment.user.username}/>
                <div className="dynamic-container ms-2" style={{maxWidth: "calc(100% - 48px)"}}>
                    <div className="d-flex align-items-center">
                        <a className="link-no-decorations" href={`/users/${comment.user.username}?page=1`}><strong>{comment.user.username}</strong></a>
                        <span className="flex-item ms-2" style={{fontSize: "0.75rem"}}>{new Date(comment.date_created).toISOString().substring(0,10)} {new Date(comment.date_created).toLocaleTimeString().substring(0,5)}</span>
                        {comment.edited && <small className="ms-1">{`(edited)`}</small>}
                        {(user.id === comment.user.id || user.is_admin == true) && 
                            <div className="ms-auto dropdown-div d-flex align-items-start">
                                <button id="announcement-dropdown-button" className="btn btn-link link-no-decorations ms-auto" style={{padding: "0"}} onClick={(e) => toggleDropdown(`comment-${comment.id}-dropdown`, e)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                    </svg>
                                </button>
                                <div id={`comment-${comment.id}-dropdown`} className="dropdown-menu">
                                    <li><button className="dropdown-item" onClick={() => toggleEditComment(comment.id)}>Edit</button></li>
                                    <li><a className="dropdown-item" onClick={() => deleteComment(comment.id)}>Delete</a></li>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="break-line-text">
                        <span id={`comment-${comment.id}-text`} style={{overflow: "visible"}} className="">{comment.text}</span>
                        <textarea id={`edit-comment-${comment.id}-text`} className="textarea-expand hidden input-field w-100" rows={1} defaultValue={comment.text} onKeyUp={(e) => {handleCommentEditTextChange(e)}} onChange={(e) => {autoResizeTextarea(e.target)}}></textarea>
                    </div>
                    {
                        user.id === comment.user.id && 
                        <div className="d-flex">
                            <button id={`comment-${comment.id}-save-button`} className="btn btn-primary ms-auto me-2 mt-2 hidden" onClick={() => saveEditComment(comment.id)}>Save</button>
                            <button id={`comment-${comment.id}-cancel-button`} className="btn btn-outline-secondary mt-2 hidden" onClick={() => toggleEditComment(comment.id)}>Cancel</button>
                        </div>
                    }
                    <div className="d-flex mb-3">
                        {parseInt(comment.amount_replies) > 0 && <button className="btn btn-link link-no-decorations p-0 pe-1" style={{color: "blue"}} onClick={() => toggleRepliesDiv()}><small>Show {comment.amount_replies} replies</small></button>}
                        {user.is_logged_in === true ? (<button className="btn btn-link link-no-decorations p-0" onClick={() => toggleReplyCreateBox(comment.id)}><small>Reply</small></button>) : (<div className="my-2"></div>)}
                    </div>
                </div>
            </div>
            
            
            <div ref={replyCreateInputDiv} id={`comment-reply-div-${comment.id}`} className="hidden" style={{marginBottom: "0.5rem", marginLeft: "3.4rem"}}>
                <div className="d-flex justify-content-center">
                    <textarea ref={replyCreateTextInput} id={`comment-reply-text-${comment.id}`} role="textbox" className="input-field textarea-expand w-100" placeholder="Add a reply..." rows={1} onClick={() => focusDiv(`comment-reply-text-${comment.id}`)} onChange={(e) => {autoResizeTextarea(e.target)}} onKeyUp={(e) => setReplyCreateText(e.target.value)}></textarea>
                    <button id={`comment-reply-button-${comment.id}`} className="btn btn-outline-secondary p-1 ms-2" onClick={() => {postCommentReply()}}><small>Reply</small></button>
                </div>
            </div>
            <div ref={commentRepliesDiv} id={`comment-replies-${comment.id}`} className="dynamic-container hidden mb-3" style={{marginLeft: "2.7rem"}}>
                {comment.replies.length > 0 &&
                comment.replies.map((reply) => (
                    <CommentReply key={reply.id} reply={reply}/>
                ))
                }
            </div>
            
        </div>
    );

}