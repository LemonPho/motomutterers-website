import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useApplicationContext } from "../../ApplicationContext";
import ProfilePictureLazyLoader from "../ProfilePictureLazyLoader";
import CommentReply from "./CommentReply";
import { useCommentsContext } from "./CommentsSectionContext";
import Dropdown from "../Dropdown";
import { useOpenersContext } from "../../OpenersContext";
import Visible from "../Visble";
import Textarea from "../Textarea";

export default function Comment({ comment, highlighted }){
    const { user } = useApplicationContext();
    const { postDeleteComment, postComment, postEditComment, highlightedCommentId, setComments } = useCommentsContext();
    const { toggleDropdown, openedDropdown, closeDropdown } = useOpenersContext();

    const [replyCreateText, setReplyCreateText] = useState("");
    const [editCommentText, setEditCommentText] = useState("");

    const [showStaticComment, setShowStaticComment] = useState(true);
    const [showEditComment, setShowEditComment] = useState(false);

    const [showReplyCreate, setShowReplyCreate] = useState(false);
    const [showRepliesDiv, setShowRepliesDiv] = useState(() => comment.replies.some(item => item.id == highlightedCommentId));

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
            setShowReplyCreate(!showReplyCreate);
        }
    }

    async function editComment(){
        if(editCommentText == ""){
            return;
        }

        const commentResponse = await postEditComment(editCommentText, comment.id);

        if(commentResponse){
            comment.text = editCommentText;
            comment.edited = true;
            setEditCommentText("");
            toggleEditComment();
        }
    }

    function toggleEditComment(){
        setShowEditComment(!showEditComment);
        setShowStaticComment(!showStaticComment);
        closeDropdown();
    }

    return(
        <div className={`rounded-15 p-2 mb-2 nested-element-color ${highlighted ? "highlighted" : ""}`} id={`comment-${comment.id}`} key={`comment-${comment.id}`}>
            <div className="d-flex align-items-start">
                <ProfilePictureLazyLoader width={"2.5rem"} height={"2.5rem"} username={comment.user.username}/>
                <div className="dynamic-container ms-2" style={{maxWidth: "calc(100% - 48px)"}}>
                    <div className="d-flex align-items-center">
                        <Link className="link-no-decorations" to={`/users/${comment.user.username}?page=1`}><strong>{comment.user.username}</strong></Link>
                        <span className="flex-item ms-2" style={{fontSize: "0.75rem"}}>{new Date(comment.date_created).toISOString().substring(0,10)} {new Date(comment.date_created).toLocaleTimeString().substring(0,5)}</span>
                        {comment.edited && <small className="ms-1">{`(edited)`}</small>}
                        {(user.id === comment.user.id || user.is_admin == true) && 
                            <div className="ms-auto dropdown-div d-flex align-items-start">
                                <button id="announcement-dropdown-button" className="btn btn-link link-no-decorations ms-auto" style={{padding: "0"}} onClick={(e) => toggleDropdown(`comment-${comment.id}-dropdown`, e)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                    </svg>
                                </button>
                                <Dropdown isOpen={openedDropdown == `comment-${comment.id}-dropdown`}>
                                    <div id={`comment-${comment.id}-dropdown`} className="dropdown-menu">
                                        {(user.id == comment.user.id) && <li><button className="dropdown-item" onClick={() => toggleEditComment(comment.id)}>Edit</button></li>}
                                        <li><a className="dropdown-item" onClick={() => deleteComment(comment.id)}>Delete</a></li>
                                    </div>
                                </Dropdown>
                            </div>
                        }
                    </div>
                    <div className="break-line-text">
                        <Visible isVisible={showStaticComment}><span id={`comment-${comment.id}-text`} style={{overflow: "visible"}} className="">{comment.text}</span></Visible>
                        <Visible isVisible={showEditComment}>
                            <div>
                                <Textarea id={`edit-comment-${comment.id}-text`} value={comment.text} setValue={setEditCommentText} onEnterFunction={editComment}/>
                                <div className="d-flex">
                                    <button id={`comment-${comment.id}-save-button`} className="btn btn-primary ms-auto me-2 mt-2 rounded-15" onClick={() => editComment(comment.id)}>Save</button>
                                    <button id={`comment-${comment.id}-cancel-button`} className="btn btn-outline-secondary mt-2 rounded-15" onClick={() => toggleEditComment(comment.id)}>Cancel</button>
                                </div>
                            </div>
                        </Visible>
                    </div>
                    <div className="d-flex">
                        {parseInt(comment.amount_replies) > 0 && <button className="btn btn-link link-no-decorations p-0 pe-1" style={{color: "blue"}} onClick={() => setShowRepliesDiv(!showRepliesDiv)}><small>Show {comment.amount_replies} replies</small></button>}
                        {user.is_logged_in === true ? (<button className="btn btn-link link-no-decorations p-0" onClick={() => setShowReplyCreate(!showReplyCreate)}><small>Reply</small></button>) : (<div className="my-2"></div>)}
                    </div>
                </div>
            </div>
            
            <Visible isVisible={showReplyCreate}>
                <div id={`comment-reply-div-${comment.id}`} style={{marginBottom: "0.5rem", marginTop: "0.5rem", marginLeft: "3.4rem"}}>
                    <div className="d-flex justify-content-center">
                        <Textarea id={`comment-reply-text-${comment.id}`} placeholder="Add a reply..." value={replyCreateText} setValue={setReplyCreateText} onEnterFunction={createCommentReply}/>
                        <button id={`comment-reply-button-${comment.id}`} className="btn btn-outline-secondary p-1 ms-2 rounded-15" onClick={() => {createCommentReply()}}><small>Reply</small></button>
                    </div>
                </div>
            </Visible>
            <Visible isVisible={showRepliesDiv}>
                <div id={`comment-replies-${comment.id}`} className="dynamic-container" style={{marginLeft: "2.7rem"}}>
                    {comment.replies.length > 0 &&
                    comment.replies.map((reply) => (
                        <CommentReply key={reply.id} reply={reply} highlighted={highlightedCommentId == reply.id}/>
                    ))
                    }
                </div>
            </Visible>
            
        </div>
    );

}