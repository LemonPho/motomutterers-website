import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";

import { getAnnouncementComments } from "../fetch-utils/fetchGet";
import { submitAnnouncementComment, submitAnnouncementCommentReply } from "../fetch-utils/fetchPost";

import ApplicationContext, { useApplicationContext } from "../ApplicationContext";
import { useAnnouncementContext } from "./AnnouncementContext";
import { toggleDropdown, focusDiv } from "../utils";

export default function AnnouncementComments(){
    const { user, loggedIn, contextLoading } = useApplicationContext();
    const { comments, retrieveComment, announcementLoading, commentsErrorMessage, setCommentsErrorMessage, resetAnnouncementMessages,
            editComment, createCommentReply, createComment, deleteComment } = useAnnouncementContext();

    const [newReplyCommentId, setNewReplyCommentId] = useState(null);

    const location = useLocation();

    async function postComment(){
        const text = document.getElementById("comment-text").innerHTML
        
        const result = createComment(text);
        if(result){
            document.getElementById("comment-text").innerHTML = "";
        }
    }

    async function postCommentReply(commentId){
        const text = document.getElementById(`comment-reply-text-${commentId}`).innerHTML;
        //hiding the reply box and button
        toggleReplyBox(commentId);    
        const result = createCommentReply(text, commentId);

        if(result){
            setNewReplyCommentId(commentId);
            document.getElementById(`comment-reply-text-${commentId}`).innerHTML = "";
        }
    }

    function toggleReplies(commentId){
        if(commentId === null){
            return;
        }
        document.getElementById(`comment-replies-${commentId}`).classList.toggle("hidden");
        
    }

    function toggleReplyBox(commentId){
        if(commentId === null){
            console.log("commentid is null");
            return;
        }
        document.getElementById(`comment-reply-div-${commentId}`).classList.toggle("hidden");
    }

    function toggleEditComment(commentId){
        const textComment = document.getElementById(`comment-${commentId}-text`);

        if(textComment == null){
            return;
        }

        const saveButton = document.getElementById(`comment-${commentId}-save-button`);
        const cancelButton = document.getElementById(`comment-${commentId}-cancel-button`);

        textComment.contentEditable = textComment.contentEditable === "false";
        textComment.classList.toggle("input-field");
        saveButton.classList.toggle("hidden");
        cancelButton.classList.toggle("hidden");
    }

    function toggleEditReply(replyId){
        const replyComment = document.getElementById(`reply-${replyId}-text`);

        if(replyComment == null){
            return;
        }

        const saveButton = document.getElementById(`reply-${replyId}-save-button`);
        const cancelButton = document.getElementById(`reply-${replyId}-cancel-button`);

        replyComment.contentEditable = replyComment.contentEditable === "false";
        replyComment.classList.toggle("input-field");
        saveButton.classList.toggle("hidden");
        cancelButton.classList.toggle("hidden");
    }

    async function saveEditReply(replyId){
        const reply = document.getElementById(`reply-${replyId}-text`);

        if(reply == null){
            return;
        }

        const result = await editComment(reply.innerHTML, replyId);

        if(!result){
            return;
        }

        toggleEditReply(replyId);
    }

    async function saveEditComment(commentId){
        const comment = document.getElementById(`comment-${commentId}-text`);

        if(comment == null){
            return;
        }

        const result = await editComment(comment.innerHTML, commentId);

        if(!result){
            return;
        }

        toggleEditComment(commentId);
    }

    async function cancelEditReply(replyId){
        const reply = document.getElementById(`reply-${replyId}-text`);

        if(reply == null){
            return;
        }

        const comment = await retrieveComment(replyId);

        if(!result){
            return;
        }

        reply.innerHTML = comment;
        toggleEditReply(replyId);
    }

    async function cancelEditComment(commentId){
        const textComment = document.getElementById(`comment-${commentId}-text`);

        if(textComment == null){
            return;
        }

        const comment = await retrieveComment(commentId);

        if(!comment){
            return;
        }

        textComment.innerHTML = comment;
        toggleEditComment(commentId);
    }

    function scrollToComment(){
        let params = new URLSearchParams(location.search);
        const commentId = params.get("comment");
        const replyId = params.get("response");

        if(commentId != null && replyId !== null){
            const commentRepliesDiv = document.getElementById(`comment-replies-${commentId}`);
            const replyDiv = document.getElementById(`reply-${replyId}`);

            if(commentRepliesDiv == null || replyDiv == null){
                return;
            }

            commentRepliesDiv.classList.toggle("hidden");
            replyDiv.scrollIntoView({ behavior: "smooth" });
            replyDiv.classList.add("div-highlight");
            return;
        }
        
        if(commentId !== null){
            const commentDiv = document.getElementById(`comment-${commentId}`);

            console.log(commentDiv);

            if(commentDiv == null){
                return;
            }

            commentDiv.scrollIntoView({ behavior: "smooth", block: "start" });
            commentDiv.classList.toggle("div-highlight");
            return;
        }
    }

    function showReplies(){
            
        if(newReplyCommentId === null){
            return;
        }
        
        const comment = document.getElementById(`comment-replies-${newReplyCommentId}`);

        if(comment.classList.contains("hidden")){
            comment.classList.toggle("hidden");
        }
        setNewReplyCommentId(null);
    }

    useEffect(() => {
        showReplies();
    }, [newReplyCommentId]);

    useEffect(() => {
        if(!announcementLoading){
            scrollToComment();
        }
    }, [announcementLoading])

    if(announcementLoading || contextLoading){
        return null;
    } else {
        return(
            <div className="card rounded-15 mt-2 p-3 element-background-color element-border-color" id="comments-card">
                <h5>Comments</h5>
                <hr />
                <div id="comments-view">
                    {loggedIn === true ? 
                    (
                        <div className="flex-box align-items-center">
                            {user.profile_picture_data ?
                            (<img className="rounded-circle" style={{width: "3rem", height: "3rem"}} src={`data: image/${user.profile_picture_format}; base64, ${user.profile_picture_data}`} alt="" />)
                            :
                            (<div>Error</div>)}
                            <div contentEditable={true} id="comment-text" className="input-field ms-2 w-100" role="textbox" data-placeholder="Write a comment..." onClick={() => focusDiv("comment-text")}></div>
                            <button className="btn btn-outline-secondary ms-2" onClick={postComment}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                                </svg>
                            </button>
                        </div> 
                    ) 
                    : 
                    (
                    <div className="d-flex justify-content-center">
                        <span>Login in to write a comment</span>
                    </div>
                    )}
                    <hr />
                    {commentsErrorMessage && <div className="alert alert-danger m-2">{commentsErrorMessage}</div>}
                    {comments ?
                        (comments.map((comment) => (
                            comment.parent_comment === null &&
                            <div id={`comment-${comment.id}`} key={`comment-${comment.id}`}>
                                <div className="d-flex align-items-start">
                                    <img className="rounded-circle" style={{width: "2.5rem", height: "2.5rem"}} src={`data: image/${comment.user.profile_picture_format}; base64, ${comment.user.profile_picture_data}`} alt="" />
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
                                            <span id={`comment-${comment.id}-text`} style={{overflow: "visible"}} className="" contentEditable={false}>{comment.text}</span>
                                        </div>
                                        {
                                            user.id === comment.user.id && 
                                            <div className="d-flex">
                                                <button id={`comment-${comment.id}-save-button`} className="btn btn-primary ms-auto me-2 mt-2 hidden" onClick={() => saveEditComment(comment.id)}>Save</button>
                                                <button id={`comment-${comment.id}-cancel-button`} className="btn btn-outline-secondary mt-2 hidden" onClick={() => cancelEditComment(comment.id)}>Cancel</button>
                                            </div>
                                        }
                                        <div className="d-flex mb-3">
                                            {parseInt(comment.amount_replies) > 0 && <button className="btn btn-link link-no-decorations p-0 pe-1" style={{color: "blue"}} onClick={() => toggleReplies(comment.id)}><small>Show {comment.amount_replies} replies</small></button>}
                                            {loggedIn === true ? (<button className="btn btn-link link-no-decorations p-0" onClick={() => toggleReplyBox(comment.id)}><small>Reply</small></button>) : (<div className="my-2"></div>)}
                                        </div>
                                    </div>
                                </div>
                                
                                
                                <div id={`comment-reply-div-${comment.id}`} className="hidden" style={{marginBottom: "0.5rem", marginLeft: "3.4rem"}}>
                                    <div className="d-flex justify-content-center">
                                        <div id={`comment-reply-text-${comment.id}`} role="textbox" contentEditable={true} className="input-field w-100" data-placeholder="Add a reply..." onClick={() => focusDiv(`comment-reply-text-${comment.id}`)}></div>
                                        <button id={`comment-reply-button-${comment.id}`} className="btn btn-outline-secondary p-1 ms-2" onClick={() => {postCommentReply(comment.id)}}><small>Reply</small></button>
                                    </div>
                                </div>
                                <div id={`comment-replies-${comment.id}`} className="dynamic-container hidden mb-3" style={{marginLeft: "2.7rem"}}>
                                    {comment.replies.length > 0 &&
                                    comment.replies.map((reply) => (
                                        <div id={`reply-${reply.id}`} key={`reply-${reply.id}`} className="dynamic-container mb-2" style={{marginLeft: "0px", maxWidth: "calc(100% - 2.7rem)"}}>
                                            <div className="d-flex align-items-start">
                                                <img className="rounded-circle" style={{width: "1.5rem", height: "1.5rem", marginTop: "6px"}} src={`data: image/${reply.user.profile_picture_format}; base64, ${reply.user.profile_picture_data}`} alt="" />
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
                                                                    <li><button className="dropdown-item" onClick={() => toggleEditReply(reply.id)}>Edit</button></li>
                                                                    <li><a className="dropdown-item" onClick={() => deleteComment(reply.id)}>Delete</a></li>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="break-line-text my-1">
                                                        <span id={`reply-${reply.id}-text`} className="" contentEditable={false}>{reply.text}</span>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                            
                                            {
                                            user.id === reply.user.id && 
                                            <div className="d-flex mt-2">
                                                <button id={`reply-${reply.id}-save-button`} className="btn btn-primary ms-auto me-2 hidden" onClick={() => saveEditReply(reply.id)}>Save</button>
                                                <button id={`reply-${reply.id}-cancel-button`} className="btn btn-outline-secondary hidden" onClick={() => cancelEditReply(reply.id)}>Cancel</button>
                                            </div>
                                        } 
                                        </div>
                                    ))
                                    }
                                </div>
                                
                            </div>
                        ))
                    )
                    :
                    (<div className="d-flex justify-content-center">
                        <span>No comments have been posted yet</span>    
                    </div>
                    )}
                </div>
            </div>
        );
    }
}