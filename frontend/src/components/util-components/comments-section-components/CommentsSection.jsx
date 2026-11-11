import React, { useEffect, useState } from "react";

import { useApplicationContext } from "../../ApplicationContext";
import { getComments } from "../../fetch-utils/fetchGet";

import Comment from "./Comment";
import CreateComment from "./CreateComment";
import { useCommentsContext } from "./CommentsSectionContext";
import { useSearchParams } from "react-router-dom";

export default function CommentsSection(){
    const { comments, commentsLoading, highlightedCommentId } = useCommentsContext();

    if(commentsLoading){
        return(
            <div>Loading...</div>
        )
    }

    return(
        <div className="card rounded-15 mt-2 element-background-color element-border-color p-2" id="comments-card">
            <div className="card-header nested-element-color rounded-15 mb-2">
                <h5>Comments</h5>
            </div>

            <div className="card-body p-0">
                <CreateComment/>
                {comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} highlighted={comment.id == highlightedCommentId}/>
                ))}
            </div>
        </div>
    );
}