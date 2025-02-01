import React, { useRef, useState } from "react";

import { useApplicationContext } from "../../ApplicationContext";
import ProfilePictureLazyLoader from "../ProfilePictureLazyLoader";
import { autoResizeTextarea, focusDiv, toggleDropdown } from "../../utils";
import CommentReply from "./CommentReply";
import { useCommentsContext } from "./CommentsSectionContext";

export default function Comment({ comment }){
    const { user, setErrorMessage } = useApplicationContext();
    const { postDeleteComment, postComment, postEditComment } = useCommentsContext();

    const [replyCreateText, setReplyCreateText] = useState("");
    const replyCreateInput = useRef(null);
    const replyCreateDiv = useRef(null);

    const commentRepliesDiv = useRef(null);

    const [editCommentText, setEditCommentText] = useState("");
    const editCommentDiv = useRef(null);
    const editCommentInput = useRef(null);
    const commentText = useRef(null);

    async function deleteComment(commentId){
        await postDeleteComment(commentId);
    }

    async function createCommentReply(){
        if(replyCreateText == ""){
            return;
        }

        const commentResponse = await postComment(replyCreateText, comment.id);

        if(commentResponse){
            setReplyCreateText("");
            replyCreateInput.current.value = "";
            toggleReplyCreateBox();
        }
    }

    async function editComment(){
        if(editCommentText == ""){
            return;
        }

        const commentResponse = await postEditComment(editCommentText, comment.id);

        if(commentResponse){
            commentText.current.innerHTML = editCommentText;
            setEditCommentText("");
            editCommentInput.current.value = "";
            toggleEditComment();
        }
    }

    function toggleEditComment(){
        if(editCommentDiv.current){
            setEditCommentText("");
            commentText.current.classList.toggle("hidden")
            editCommentDiv.current.classList.toggle("hidden")
        }
    }

    function toggleRepliesDiv(){
        if(commentRepliesDiv.current){
            commentRepliesDiv.current.classList.toggle("hidden");
        }
    }

    function toggleReplyCreateBox(){
        if(replyCreateDiv.current){
            setReplyCreateText("");
            replyCreateDiv.current.classList.toggle("hidden");
        }
    }

    if(comment.id == 173){
        console.log(comment);
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
                        <span ref={commentText} id={`comment-${comment.id}-text`} style={{overflow: "visible"}} className="">{comment.text}</span>
                        <div ref={editCommentDiv} className="hidden">
                            <textarea ref={editCommentInput} id={`edit-comment-${comment.id}-text`} className="textarea-expand input-field w-100" rows={1} defaultValue={comment.text} onKeyUp={(e) => setEditCommentText(e.target.value)} onChange={(e) => {autoResizeTextarea(e.target)}}></textarea>
                            <div className="d-flex">
                                <button id={`comment-${comment.id}-save-button`} className="btn btn-primary ms-auto me-2 mt-2" onClick={() => editComment(comment.id)}>Save</button>
                                <button id={`comment-${comment.id}-cancel-button`} className="btn btn-outline-secondary mt-2" onClick={() => toggleEditComment(comment.id)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex mb-3">
                        {parseInt(comment.amount_replies) > 0 && <button className="btn btn-link link-no-decorations p-0 pe-1" style={{color: "blue"}} onClick={() => toggleRepliesDiv()}><small>Show {comment.amount_replies} replies</small></button>}
                        {user.is_logged_in === true ? (<button className="btn btn-link link-no-decorations p-0" onClick={() => toggleReplyCreateBox(comment.id)}><small>Reply</small></button>) : (<div className="my-2"></div>)}
                    </div>
                </div>
            </div>
            
            
            <div ref={replyCreateDiv} id={`comment-reply-div-${comment.id}`} className="hidden" style={{marginBottom: "0.5rem", marginLeft: "3.4rem"}}>
                <div className="d-flex justify-content-center">
                    <textarea ref={replyCreateInput} id={`comment-reply-text-${comment.id}`} role="textbox" className="input-field textarea-expand w-100" placeholder="Add a reply..." rows={1} onClick={() => focusDiv(`comment-reply-text-${comment.id}`)} onChange={(e) => {autoResizeTextarea(e.target)}} onKeyUp={(e) => setReplyCreateText(e.target.value)}></textarea>
                    <button id={`comment-reply-button-${comment.id}`} className="btn btn-outline-secondary p-1 ms-2" onClick={() => {createCommentReply()}}><small>Reply</small></button>
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