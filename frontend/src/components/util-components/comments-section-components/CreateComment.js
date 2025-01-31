import React, { useRef, useState } from "react";

import { submitComment } from "../../fetch-utils/fetchPost";
import { useApplicationContext } from "../../ApplicationContext";
import ProfilePictureLazyLoader from "../ProfilePictureLazyLoader";
import { autoResizeTextarea } from "../../utils";

export default function CreateComment({ parentElement }){
    const { user, setErrorMessage } = useApplicationContext();

    const [commentText, setCommentText] = useState("");
    const commentTextInput = useRef(null);

    async function postComment(){
        const commentResponse = await submitComment(commentText, parentElement, null);

        if(commentResponse.error || commentResponse.status != 201){
            setErrorMessage("There was an error submiting the comment");
            return;
        }

        commentTextInput.value = "";
        setCommentText("");
    }

    if(!user.is_logged_in){
        return(
            <div className="d-flex justify-content-center">
                <span>Login in to write a comment</span>
            </div>
        );
    }

    return(
        <div className="flex-box align-items-center">
            <ProfilePictureLazyLoader width={"3rem"} height={"3rem"} username={user.username}/>
            <textarea ref={commentTextInput} id="comment-text" className="input-field textarea-expand ms-2 w-100" rows={1} placeholder="Write a comment..." onChange={(e) => {autoResizeTextarea(e.target)}} onKeyUp={(e) => setCommentText(e.target.value)}></textarea>
            <button className="btn btn-outline-secondary ms-2" onClick={postComment}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                </svg>
            </button>
        </div>
    );
}