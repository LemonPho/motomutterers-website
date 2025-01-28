import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";

import ApplicationContext, { useApplicationContext } from "./ApplicationContext";
import { getUser, getUserComments } from "./fetch-utils/fetchGet";
import { pagination } from "./utils";
import PageNotFound from "./PageNotFound";
import ProfilePictureLazyLoader from "./util-components/ProfilePictureLazyLoader";

//could be separated into separate components, works for now like this
export default function UserPage(){
    const [displayUserUsername, setDisplayUserUsername] = useState(useParams().username)
    const [displayUserFound, setDisplayUserFound] = useState(true);
    const [displayUser, setDisplayUser] = useState(null);
    const [displayUserLoading, setDisplayUserLoading] = useState(true);

    const [pages, setPages] = useState(false);
    const [currentPage, setCurrentPage] = useState(null);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [pageNumbers, setPageNumbers] = useState([]);
    const [paginationLoading, setPaginationLoading] = useState(true);

    const [comments, setComments] = useState([]);
    const [amountComments, setAmountComments] = useState(null);
    const [commentsLoading, setCommentsLoading] = useState(true);

    const {user, contextLoading, setErrorMessage} = useApplicationContext();

    const location = useLocation();

    async function retrieveDisplayUser(){
        const tempDisplayUser = await getUser(displayUserUsername);

        if(tempDisplayUser.status === 404){
            setDisplayUserFound(false);
            setDisplayUserLoading(false);
            return;
        }

        if(tempDisplayUser.error){
            console.log(tempDisplayUser.error);
            setErrorMessage("There was an error while loading the user data");
            setDisplayUserLoading(false);
            return;
        }

        setDisplayUser(tempDisplayUser.user);
        setDisplayUserLoading(false);
    }

    async function retrieveDisplayUserComments(){
        setCommentsLoading(true);
        const params = new URLSearchParams(location.search);
        const page = params.get("page");
        const tempComments = await getUserComments(displayUserUsername, page);
        setCurrentPage(page);

        if(tempComments.error){
            console.log(tempComments.error);
            setComments(false);
            setCommentsLoading(false);
            return;
        }

        if(tempComments.status != 200){
            setComments(false);
            setCommentsLoading(false);
            return;
        }

        setComments(tempComments.comments);
        setAmountComments(tempComments.amountComments);
        setCommentsLoading(false);
    }

    useEffect(() => {
        retrieveDisplayUser();
        if(displayUserFound){
            retrieveDisplayUserComments();
        }
    }, []);

    useEffect(() => {
        if(amountComments !== null){
            let result = pagination(amountComments, 15, currentPage);
            if(result !== null){
                setPages(true);
                setNextPage(result.nextPage);
                setPreviousPage(result.previousPage);
                setPageNumbers(result.pageNumbers);
            }
        }

        setPaginationLoading(false);
    }, [amountComments])

    if(displayUserLoading || paginationLoading || contextLoading || commentsLoading){
        return null;
    }

    if(!displayUserFound){
        return <PageNotFound/>
    }

    return(
        <div>
            <div className="row">
                <div className="col-md-4">
                    <div id="user-view" className="card rounded-15 p-3 element-background-color element-border-color">
                        <div className="d-flex align-items-center justify-content-center">
                            <ProfilePictureLazyLoader width={"7rem"} height={"7rem"} username={displayUser.username}/>
                        </div>
                        <div className="d-flex justify-content-center">
                            <div style={{ fontSize: "30px" }}>{displayUser.username}</div>
                        </div>
                        {displayUser.id === user.id && 
                        <div className="d-flex justify-content-center align-items-center link-no-decorations">
                            <a className="link-no-decorations" href={`/settings`}>
                                <span>Edit</span>
                                <svg style={{marginLeft: "0.15rem"}} xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none">
                                    <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </a>
                        </div>}
                        <hr />
                        <h5>Account created on</h5>
                        <span>{new Date(displayUser.date_created).toISOString().substring(0,10)}</span>
                    </div>
                </div>
                <div className="col-md-8">
                    <div id="comments-view" className="card rounded-15 element-background-color element-border-color">
                        <div className="card-header">
                            <h3>Comments</h3>
                        </div>
                        <div className="card-body">
                            {comments.length === 0 && <div><hr /><h6>User hasn't posted any comments</h6></div>}
                            {comments.map((comment) => (
                                <div key={`comment-${comment.id}`}>
                                    {comment.parent_comment !== null ? 
                                    (
                                        <div>
                                            <div className="d-flex align-items-center">
                                                <svg style={{marginRight: "0.3rem"}} xmlns="http://www.w3.org/2000/svg" fill="#5A5A5A" width="1rem" height="1rem" viewBox="0 0 512 512">
                                                    <path d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 7.1 5.8 12 12 12 2.4 0 4.9-.7 7.1-2.4L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64zm16 352c0 8.8-7.2 16-16 16H288l-12.8 9.6L208 428v-60H64c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16h384c8.8 0 16 7.2 16 16v288z"/>
                                                </svg>
                                                <ProfilePictureLazyLoader width={"2rem"} height={"2rem"} username={comment.parent_comment.user.username}/>
                                                <span className="mx-1">•</span>
                                                <a className="link-no-decorations" href={`/announcements/${comment.announcement.id}?comment=${comment.parent_comment.id}`}><i>{comment.parent_comment.text}</i></a>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <svg style={{marginLeft: "1.8rem"}} width="1.5rem" height="1.5rem" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M9.87737 12H9.9H11.5C11.7761 12 12 11.7761 12 11.5C12 11.2239 11.7761 11 11.5 11H9.9C8.77164 11 7.95545 10.9996 7.31352 10.9472C6.67744 10.8952 6.25662 10.7946 5.91103 10.6185C5.25247 10.283 4.71703 9.74753 4.38148 9.08897C4.20539 8.74338 4.10481 8.32256 4.05284 7.68648C4.00039 7.04455 4 6.22836 4 5.1V3.5C4 3.22386 3.77614 3 3.5 3C3.22386 3 3 3.22386 3 3.5V5.1V5.12263C3 6.22359 3 7.08052 3.05616 7.76791C3.11318 8.46584 3.23058 9.0329 3.49047 9.54296C3.9219 10.3897 4.61031 11.0781 5.45704 11.5095C5.9671 11.7694 6.53416 11.8868 7.23209 11.9438C7.91948 12 8.77641 12 9.87737 12Z"
                                                    fill="grey"
                                                />
                                                </svg>
                                                <a className="link-no-decorations" href={`/announcements/${comment.announcement.id}?comment=${comment.parent_comment.id}&response=${comment.id}`}><span style={{marginTop: "0.5rem"}}>{comment.text}</span></a>
                                            </div>
                                        </div>
                                    ) 
                                    : 
                                    (
                                        <div>
                                            <div className="d-flex align-items-center">
                                                <svg style={{marginRight: "0.15rem"}} xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 24 24" fill="none">
                                                    <path d="M7 8H17M7 12H17M7 16H13M4 4H20V20H4V4Z" stroke="#5A5A5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                                <ProfilePictureLazyLoader width={"2rem"} height={"2rem"} username={comment.announcement.user.username}/>
                                                <span className="mx-1">•</span>
                                                <a className="link-no-decorations" href={`/announcements/${comment.announcement.id}`}><i>{comment.announcement.title}</i></a>
                                                {/*<!-- License: MIT. Made by radix-ui: https://github.com/radix-ui/icons -->*/}
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <svg style={{marginLeft: "2rem"}} width="1.5rem" height="1.5rem" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M9.87737 12H9.9H11.5C11.7761 12 12 11.7761 12 11.5C12 11.2239 11.7761 11 11.5 11H9.9C8.77164 11 7.95545 10.9996 7.31352 10.9472C6.67744 10.8952 6.25662 10.7946 5.91103 10.6185C5.25247 10.283 4.71703 9.74753 4.38148 9.08897C4.20539 8.74338 4.10481 8.32256 4.05284 7.68648C4.00039 7.04455 4 6.22836 4 5.1V3.5C4 3.22386 3.77614 3 3.5 3C3.22386 3 3 3.22386 3 3.5V5.1V5.12263C3 6.22359 3 7.08052 3.05616 7.76791C3.11318 8.46584 3.23058 9.0329 3.49047 9.54296C3.9219 10.3897 4.61031 11.0781 5.45704 11.5095C5.9671 11.7694 6.53416 11.8868 7.23209 11.9438C7.91948 12 8.77641 12 9.87737 12Z"
                                                    fill="grey"
                                                />
                                                </svg>
                                                <a className="link-no-decorations" style={{marginTop: "0.5rem"}} href={`/announcements/${comment.announcement.id}?comment=${comment.id}`}><span>{comment.text}</span></a>
                                            </div>
                                        </div> 
                                    )}
                                    <hr />                                
                                </div>
                            ))}
                        </div>
                        <div className="card-footer">
                        {comments.length !== 0 && pages && 
                            <nav id="pagination-view">
                                <ul className='pagination justify-content-center'>
                                    <li id='previous-page' className={`${previousPage}`}>
                                        <a id='previous-page-link' href={`/users/${displayUserUsername}?page=${parseInt(currentPage)-1}`} className='page-link'>Previous</a>
                                    </li>
                                    {pageNumbers.map((page) => (
                                        parseInt(currentPage) !== page ?
                                        ( 
                                        <li id={`page-${page}`} key={`page-${page}`} className="page-item">
                                            <a id={`page-link-${page}`} href={`/users/${displayUserUsername}?page=${page}`} className='page-link'>{page}</a>
                                        </li>
                                        )
                                        :
                                        (
                                        <li id={`page-${page}`} key={`page-${page}`} className="page-item disabled">
                                            <a id={`page-link-${page}`} href={`/users/${displayUserUsername}?page=${page}`} className='page-link'>{page}</a>
                                        </li>
                                        )
                                        ))}
                                    <li id='next-page' className={`${nextPage}`}>
                                        <a id='next-page-link' href={`/users/${displayUserUsername}?page=${parseInt(currentPage)+1}`} className='page-link'>Next</a>
                                    </li>
                                </ul>
                            </nav>
                            }
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}