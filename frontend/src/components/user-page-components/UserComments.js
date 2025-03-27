import React, { useEffect, useState } from "react";
import CommentsPages from "./CommentsPages";
import { getUserComments } from "../fetch-utils/fetchGet";
import { Link, useLocation, useSearchParams } from "react-router-dom";

export default function UserComments({ username }){
    const [searchParams] = useSearchParams();
    const location = useLocation();

    const [ currentPage, setCurrentPage ] = useState(searchParams.get("page"));

    const [ amountComments, setAmmountComments ] = useState(0);
    const [ comments, setComments ] = useState([]);

    async function retrieveDisplayUserComments(){
        const commentsResponse = await getUserComments(username, currentPage);

        if(commentsResponse.error){
            setErrorMessage("There was an error retrieving the user comments");
            return;
        }

        if(commentsResponse.status == 404){
            setErrorMessage("The user was not found");
            return;
        }

        setComments(commentsResponse.comments);
        setAmmountComments(commentsResponse.amountComments);
    }

    useEffect(() => {
        async function fetchData(){
            await retrieveDisplayUserComments();
        }

        fetchData();
    }, [currentPage]);

    useEffect(() => {
        const tempCurrentPage = searchParams.get("page");
        if(tempCurrentPage != currentPage){
            setCurrentPage(tempCurrentPage);
        }
    }, [location])

    return(
        <div className="col-md-8">
            <div id="comments-view" className="card rounded-15 element-background-color element-border-color">
                <div className="card-header rounded-15 nested-element-color m-2">
                    <h3>Comments</h3>
                </div>
                <div className="card-body p-0">
                    {(comments.length === 0) && <div className="rounded-15 nested-element-color m-2 p-2"><h6>User hasn't posted any comments</h6></div>}
                    {(!comments) && <div className="rounded-15 nested-element-color m-2 p-2"><h6>Error loading comments</h6></div>}
                    {(comments) && comments.map((comment) => (
                        <div key={`comment-${comment.id}`} className="rounded-15 nested-element-color m-2 p-2">
                            {comment.parent_comment != null ? 
                            (
                                <div>
                                    <div className="d-flex align-items-center">
                                        <svg style={{marginRight: "0.3rem"}} xmlns="http://www.w3.org/2000/svg" fill="#5A5A5A" width="1rem" height="1rem" viewBox="0 0 512 512">
                                            <path d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 7.1 5.8 12 12 12 2.4 0 4.9-.7 7.1-2.4L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64zm16 352c0 8.8-7.2 16-16 16H288l-12.8 9.6L208 428v-60H64c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16h384c8.8 0 16 7.2 16 16v288z"/>
                                        </svg>
                                        {comment.parent_comment.announcement != null && <Link className="link-no-decorations" to={`/announcements/${comment.parent_comment.announcement.id}?comment=${comment.parent_comment.id}`}><i>{comment.parent_comment.text}</i></Link>}
                                        {comment.parent_comment.race_weekend != null && <Link className="link-no-decorations" to={`/race_weekend/${comment.parent_comment.race_weekend.id}?comment=${comment.parent_comment.id}`}><i>{comment.parent_comment.text}</i></Link>}
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
                                        {comment.parent_comment.announcement != null && <Link className="link-no-decorations" to={`/announcements/${comment.parent_comment.announcement.id}?comment=${comment.id}`}><span>{comment.text}</span></Link>}
                                        {comment.parent_comment.race_weekend != null && <Link className="link-no-decorations" to={`/race_weekend/${comment.parent_comment.race_weekend.id}?comment=${comment.id}`}><span>{comment.text}</span></Link>}                                            
                                    </div>
                                </div>
                            ) 
                            : 
                            (
                                <div>
                                    <div className="d-flex align-items-center">
                                        {comment.announcement != null &&
                                        <>
                                            <svg style={{marginRight: "0.15rem"}} xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 24 24" fill="none">
                                                <path d="M7 8H17M7 12H17M7 16H13M4 4H20V20H4V4Z" stroke="#5A5A5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <Link className="link-no-decorations" to={`/announcements/${comment.announcement.id}?comment=${comment.id}`}><i>{comment.announcement.title}</i></Link>
                                        </>}

                                        {comment.race_weekend != null && 
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" width="1.2rem" height="1.2rem" viewBox="0 0 410 450" space="preserve">
                                                <g>
                                                    <g>
                                                    <path d="M 355.839 322.508 L 365.987 302.471 C 405.157 221.386 411.618 158.553 386.352 114.688 C 350.827 53.012 245.064 55.986 245.064 55.986 C 149.675 55.986 89.435 122.79 89.435 122.79 C 58.693 155.456 27.517 217.337 13.79 258.975 C 13.79 258.975 11.446 266.186 10.892 268.627 C 10.473 270.471 10.097 272.323 10.097 274.223 L 10.097 324.321 C 10.097 329.678 12.179 334.712 15.962 338.496 C 19.737 342.274 24.757 344.357 30.097 344.357 L 30.118 344.357 L 332.333 344.311 C 339.599 344.302 346.296 340.041 349.812 333.673 C 351.886 329.916 353.89 326.198 355.839 322.508 Z M 239.295 190.74 C 226.516 198.358 196.867 206.167 170.707 213.06 C 158.621 216.245 147.205 219.252 137.264 222.232 C 121.02 227.105 99.628 230.64 80.896 234.872 C 99.117 190.514 129.313 150.635 153.733 129.347 C 153.733 129.347 254.232 129.347 263.26 129.347 C 272.288 129.347 278.215 133.135 278.26 140.51 C 278.26 158.428 265.15 175.329 239.295 190.74 Z" fill="none" stroke="#5A5A5A" strokeWidth="25"/>
                                                    </g>
                                                </g>
                                            </svg>
                                            <Link className="link-no-decorations" to={`/race_weekend/${comment.race_weekend.id}?comment=${comment.id}`}><i>{comment.race_weekend.title}</i></Link>                                                
                                        </>}

                                    </div>
                                    <div className="d-flex align-items-center">
                                        <svg style={{marginLeft: "2rem"}} width="1.5rem" height="1.5rem" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M9.87737 12H9.9H11.5C11.7761 12 12 11.7761 12 11.5C12 11.2239 11.7761 11 11.5 11H9.9C8.77164 11 7.95545 10.9996 7.31352 10.9472C6.67744 10.8952 6.25662 10.7946 5.91103 10.6185C5.25247 10.283 4.71703 9.74753 4.38148 9.08897C4.20539 8.74338 4.10481 8.32256 4.05284 7.68648C4.00039 7.04455 4 6.22836 4 5.1V3.5C4 3.22386 3.77614 3 3.5 3C3.22386 3 3 3.22386 3 3.5V5.1V5.12263C3 6.22359 3 7.08052 3.05616 7.76791C3.11318 8.46584 3.23058 9.0329 3.49047 9.54296C3.9219 10.3897 4.61031 11.0781 5.45704 11.5095C5.9671 11.7694 6.53416 11.8868 7.23209 11.9438C7.91948 12 8.77641 12 9.87737 12Z" fill="grey"/>
                                        </svg>
                                        {comment.announcement != null && <Link className="link-no-decorations" to={`/announcements/${comment.announcement.id}?comment=${comment.id}`}><span>{comment.text}</span></Link>}
                                        {comment.race_weekend != null && <Link className="link-no-decorations" to={`/race_weekend/${comment.race_weekend.id}?comment=${comment.id}`}><span>{comment.text}</span></Link>}
                                    </div>
                                </div> 
                            )}
                        </div>
                    ))}
                </div>

                <div className="card-footer rounded-15 nested-element-color m-2">
                    <CommentsPages currentPage={currentPage} amountComments={amountComments} />
                </div>
            </div>
        </div>
    );
}