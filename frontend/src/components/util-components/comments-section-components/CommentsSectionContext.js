import React, { createContext, useContext, useState } from "react";
import { getComments } from "../../fetch-utils/fetchGet";
import { useApplicationContext } from "../../ApplicationContext";
import { submitComment, submitDeleteComment, submitEditComment } from "../../fetch-utils/fetchPost";

const CommentsContext = createContext();

export default function CommentsContextProvider({ parentElement, children }){
    const { setErrorMessage } = useApplicationContext();

    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState();

    async function retrieveComments(){
        setCommentsLoading(true);

        const commentsResponse = await getComments(parentElement);

        if(commentsResponse.error || commentsResponse.status != 200){
            setErrorMessage("There was an error getting the comments");
            return false;
        }

        setComments(commentsResponse.comments);
        setCommentsLoading(false);
        return true;
    }

    async function postComment(text, commentId){
        const commentResponse = await submitComment(text, parentElement, commentId);

        if(commentResponse.error || commentResponse.status != 201){
            setErrorMessage("There was an error posting the comment");
            return false;
        }

        await retrieveComments();
        return true;
    }

    async function postEditComment(text, commentId){
        const commentResponse = await submitEditComment(text, commentId);

        if(commentResponse.error || commentResponse.status != 201){
            setErrorMessage("There was an error posting the comment");
            return false;
        }

        return true;
    }

    async function postDeleteComment(commentId){
        const commentResponse = await submitDeleteComment(commentId);

        if(commentResponse.error || commentResponse.status != 201){
            setErrorMessage("There was an error deleting the comment");
            return false;
        }

        //TODO: work on a way to just insert the new comment into the comment list
        await retrieveComments();
        return true;
    }

    return(
        <CommentsContext.Provider value={{
            comments, commentsLoading, setComments, retrieveComments, postComment, postEditComment, postDeleteComment,
            parentElement,
        }}>
        {children}

        </CommentsContext.Provider>
    )
}

export function useCommentsContext(){
    return useContext(CommentsContext);
}