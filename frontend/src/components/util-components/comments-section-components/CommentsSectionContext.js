import React, { createContext, useContext, useEffect, useState } from "react";
import { getComments } from "../../fetch-utils/fetchGet";
import { useApplicationContext } from "../../ApplicationContext";
import { submitComment, submitDeleteComment, submitEditComment } from "../../fetch-utils/fetchPost";
import { useSearchParams } from "react-router-dom";
import useImagesContext from "../../ImagesContext";

const CommentsContext = createContext();

export default function CommentsContextProvider({ parentElement, children }){
    const { setErrorMessage, user, setLoadingMessage, resetApplicationMessages } = useApplicationContext();
    const { prepareProfilePictures } = useImagesContext();

    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState();

    const [highlightedCommentId, setHighlightedCommentId] = useState(null);
    const [searchParams] = useSearchParams();

    async function retrieveComments(){
        setCommentsLoading(true);

        const commentsResponse = await getComments(parentElement);

        if(commentsResponse.error || commentsResponse.status != 200){
            setErrorMessage("There was an error getting the comments");
            return false;
        }

        const userList = [
            ...commentsResponse.comments.map(comment => comment.user),
            ...commentsResponse.comments.flatMap(comment => comment.replies.map(reply => reply.user)),
        ];
        prepareProfilePictures(userList);

        setComments(commentsResponse.comments);
        setCommentsLoading(false);
        return true;
    }

    async function postComment(text, commentId){
        resetApplicationMessages();
        setLoadingMessage("Loading...");
        const commentResponse = await submitComment(text, parentElement, commentId);
        setLoadingMessage(false);

        if(commentResponse.error || commentResponse.status != 201){
            setErrorMessage("There was an error posting the comment");
            return false;
        }

        const newCommentId = commentResponse.newCommentId;
        const newComment = {
            text: text,
            user: user,
            id: newCommentId,
            replies: [],
            amount_replies: 0,
            date_created: new Date().toISOString(),
        }

        if(commentId){
            let newCommentsArray = comments;
            for(let i=0; i < newCommentsArray.length; i++){
                if(newCommentsArray[i].id == commentId){
                    newCommentsArray[i].amount_replies++;
                    newCommentsArray[i].replies.unshift(newComment);
                    break;
                }
            }
            setComments(newCommentsArray);
        } else {
            setComments(prevComments => [newComment, ...prevComments]);
        }
        
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

        setComments(prevComments => prevComments.filter(comment => comment.id != commentId));
        return true;
    }

    useEffect(() => {
        async function fetchData(){
            await retrieveComments();
            if(searchParams.get("comment")){
                setHighlightedCommentId(searchParams.get("comment"));
            }
        }

        fetchData();
    }, [])

    return(
        <CommentsContext.Provider value={{
            comments, commentsLoading, setComments, retrieveComments, postComment, postEditComment, postDeleteComment,
            parentElement, highlightedCommentId,
        }}>
        {children}

        </CommentsContext.Provider>
    )
}

export function useCommentsContext(){
    return useContext(CommentsContext);
}