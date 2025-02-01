import React, { useEffect, useState } from "react";

import { useApplicationContext } from "../../ApplicationContext";
import { getComments } from "../../fetch-utils/fetchGet";

import Comment from "./Comment";
import CreateComment from "./CreateComment";
import { useCommentsContext } from "./CommentsSectionContext";

export default function CommentsSection(){
    const { setErrorMessage } = useApplicationContext();
    const { comments, commentsLoading, retrieveComments, parentElement } = useCommentsContext();

    useEffect(() => {
        async function getData(){
            await retrieveComments();
        }

        getData();
    }, []);

    if(commentsLoading){
        return(
            <div>Loading...</div>
        )
    }

    return(
        <div className="card rounded-15 mt-2 element-background-color element-border-color" id="comments-card">
            <div className="card-header">
                <h5>Comments</h5>
            </div>

            <div className="card-body">
                <CreateComment/>
                <hr />
                {comments.map((comment) => (
                    <Comment key={comment.id} comment={comment}/>
                ))}
            </div>
        </div>
    );
}