import React, { useEffect } from "react";

import { useApplicationContext } from "../../ApplicationContext";
import { getComments } from "../../fetch-utils/fetchGet";

import Comment from "./Comment";
import CreateComment from "./CreateComment";

export default function CommentsSection({ comments, parentElement }){
    return(
        <div className="card rounded-15 mt-2 element-background-color element-border-color" id="comments-card">
            <div className="card-header">
                <h5>Comments</h5>
            </div>

            <div className="card-body">
                <CreateComment parentElement={parentElement}/>
                <hr />
                {comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} parentElement={parentElement}/>
                ))}
            </div>
        </div>
    );
}