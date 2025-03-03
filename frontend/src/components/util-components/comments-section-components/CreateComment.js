import React, { useRef, useState } from "react";

import { useApplicationContext } from "../../ApplicationContext";
import ProfilePictureLazyLoader from "../ProfilePictureLazyLoader";
import { useCommentsContext } from "./CommentsSectionContext";
import Textarea from "../Textarea";

export default function CreateComment(){
    const { user, userLoading } = useApplicationContext();
    const { postComment } = useCommentsContext();

    const [commentText, setCommentText] = useState("");

    async function createComment(){
        const commentResponse = await postComment(commentText, null);

        if(commentResponse){
            setCommentText("");
        }
    }

    if(userLoading){
        return;
    }

    if(!user.is_logged_in){
        return(
            <div className="d-flex justify-content-center rounded-15 nested-element-color p-2 mb-2">
                <span>Login in to write a comment</span>
            </div>
        );
    }

    return(
        <div className="flex-box align-items-center rounded-15 nested-element-color p-2 mb-2" >
            <ProfilePictureLazyLoader width={"3rem"} height={"3rem"} username={user.username}/>
            <Textarea id="create-comment" value={commentText} setValue={setCommentText} onEnterFunction={createComment} placeholder="Write a comment" className={"ms-2"}/>
            <button className="btn btn-outline-secondary ms-2 rounded-15" onClick={createComment}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                </svg>
            </button>
        </div>
    );
}