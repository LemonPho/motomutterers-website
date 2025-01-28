import React, { useEffect } from "react";
import { useRaceResultsContext } from "./RaceResultsContext";
import { useApplicationContext } from "../ApplicationContext";
import ProfilePictureLazyLoader from "../util-components/ProfilePictureLazyLoader";

export default function RaceResultComments({ raceId }){

    const { user, userLoading } = useApplicationContext();
    const { raceResultComments, raceResultCommentsLoading, raceResultDetailsLoading, retrieveRaceResultComments } = useRaceResultsContext();

    useEffect(() => {
        async function getRaceComments(){
            await retrieveRaceResultComments(raceId);
        }

        getRaceComments();
    }, [raceId]);

    if(raceResultDetailsLoading){
        return null;
    }

    return(
        <div className="card rounded-15 element-background-color element-border-color" id="race-comments-card">
            <div className="card-header rounded-15-top">
                <div className="p-1">
                    <h5 style={{margin: "0px"}}>Comments</h5>
                </div>
            </div>
            <div className="card-body">
                <div id="comment-create">
                    {(!userLoading && !user.is_logged_in) &&  <div className="d-flex justify-content-center w-100"><span>You must log in to create a comment</span></div>}
                    {(!userLoading && user.is_logged_in) &&
                    <div className="flex-box align-items-center">
                        <ProfilePictureLazyLoader width="3.5rem" height="3.5rem" username={user.username}/>
                        <textarea className="input-field ms-2 w-100 textarea-expand" rows={1} name="create-comment-text" id="create-comment-text" placeholder="Write a comment..." onChange={(e) => {autoResizeTextarea(e.target)}}></textarea>
                        <button className="btn btn-outline-secondary ms-2" onClick={console.log("clicked")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                            </svg>
                        </button>
                    </div>
                    }
                </div>
                <hr />
                {console.log(raceResultComments)}
                {(!raceResultCommentsLoading && !raceResultComments) && 
                    <span>No comments have been posted</span>
                }
                {(!raceResultCommentsLoading && raceResultComments) && 
                    raceResultComments.map((comment) => (
                        comment.parent_comment === null &&
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
                                        {user.is_logged_in === true ? (<button className="btn btn-link link-no-decorations p-0" onClick={() => toggleReplyBox(comment.id)}><small>Reply</small></button>) : (<div className="my-2"></div>)}
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
                }
            </div>
        </div>
    );
    
}