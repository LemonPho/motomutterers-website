import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';

import ApplicationContext, { useApplicationContext } from './ApplicationContext';

import { getAnnouncements } from './fetch-utils/fetchGet';
import { submitAnnouncement } from './fetch-utils/fetchPost';
import { autoResizeTextarea, closeModals, pagination, toggleModal } from './utils';
import ProfilePictureLazyLoader from './util-components/ProfilePictureLazyLoader';

export default function Anouncements(){
    const [announcements, setAnnouncements] = useState([]);
    const [announcementsLoading, setAnnouncementsLoading] = useState(true);

    const [totalAnnouncements, setTotalAnnouncements] = useState(0);

    const {user, userLoading, setErrorMessage, setSuccessMessage, resetApplicationMessages, setLoadingMessage} = useApplicationContext();

    const [pages, setPages] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [previousPage, setPreviousPage] = useState("");
    const [nextPage, setNextPage] = useState("");
    const [pageNumbers, setPageNumbers] = useState([]);

    const location = useLocation();

    const [newAnnouncementText, setNewAnnouncementText] = useState("");
    const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");

    function resetNewAnnouncementVariables(){
        setNewAnnouncementText("");
        setNewAnnouncementTitle("");
    }

    async function retrieveAnnouncements(){
        setAnnouncementsLoading(true);
        const params = new URLSearchParams(location.search);
        let page = params.get("page");
        setCurrentPage(page);

        const announcementsResponse = await getAnnouncements(page);
        if(announcementsResponse.error || announcementsResponse.status !== 200){
            setErrorMessage("There was an error while loading the announcements");
            console.log(announcementsResponse.error);
            return;
        }

        setAnnouncements(announcementsResponse.announcements);
        setTotalAnnouncements(announcementsResponse.amountAnnouncements);
        setAnnouncementsLoading(false);
    }

    //when totalAnnouncements is asigned, we can generate the pagination necessary, no need to check if its 0, it will just generate a disabled pagination menu
    useEffect(() => {
        let result = pagination(totalAnnouncements, 10, currentPage);
        if(result !== null){
            setNextPage(result.nextPage);
            setPreviousPage(result.previousPage);
            setPageNumbers(result.pageNumbers);
            setPages(true);
        }
        
    }, [totalAnnouncements]);

    async function postAnnouncement(){
        resetApplicationMessages();
        setLoadingMessage("Loading..");
        if(!user.is_admin){
            setErrorMessage("There was an error submiting the announcement");
            return;
        }

        const announcementResponse = await submitAnnouncement(newAnnouncementTitle, newAnnouncementText);

        if(announcementResponse.error){
            setErrorMessage("There was an error submiting the announcement");
            return;
        }

        if(announcementResponse.status === 400){
            setErrorMessage("Be sure the title has less than 128 characters and the text 2048 characters");
            return;
        }

        if(announcementResponse.status === 200){
            setSuccessMessage("Announcement posted");
            setLoadingMessage(false);
            retrieveAnnouncements();
            closeModals();
            return;
        }

        setErrorMessage("There was a server error while submiting the announcement");
        return;
    }

    function handleAnnouncementTextChange(event){
        setNewAnnouncementText(event.target.value);
    }

    function handleAnnouncementTitleChange(event){
        setNewAnnouncementTitle(event.target.value);
    }

    useEffect(() => {
        retrieveAnnouncements();
    }, [location.search]);

    return(
        <div className='card element-background-color element-border-color rounded-15'>
            <div className='card-header d-flex align-items-center'>
                <h5>Announcements</h5>
                {(!userLoading && user.is_admin) && <button className='btn btn-primary ms-auto rounded-15' onClick={(e) => {resetNewAnnouncementVariables();toggleModal("announcement-create-modal", e, undefined, user.is_admin)}}>Create Announcement</button>}
            </div>
            <div className='card-body'>
            {(!announcementsLoading && announcements.length != 0) && announcements.map((announcement) => (
                <Link className='clickable card mx-auto my-3 rounded-15 element-background-color link-no-decorations' to={`/announcements/${announcement.id}`} key={announcement.id}>
                    
                    <div className='card-header d-flex align-items-center'>
                        <ProfilePictureLazyLoader width={"2rem"} height="2rem" username={announcement.user.username}/>
                        <small className='ms-2'>{announcement.user.username}</small>
                        <small className='ms-auto'>{new Date(announcement.date_created).toISOString().substring(0,10)}</small>
                    </div>
                    
                    <div className='card-body announcement-card-body'>
                        <h5>{announcement.title}</h5>
                        <span>{announcement.text}</span>
                    </div>

                    <div className='card-footer'>
                        <small>Comments: {announcement.amount_comments}</small>
                    </div>                 
                </Link>
            ))}
            </div>
            <div className='card-footer'>
                {pages && 
                <nav id="pagination-view ">
                    <ul className='pagination justify-content-center'>
                        <li id='previous-page' className={`${previousPage}`}>
                            <Link id='previous-page-link' to={`?page=${parseInt(currentPage)-1}`} className='page-link'>Previous</Link>
                        </li>
                        {pageNumbers.map((page) => (
                            parseInt(currentPage) !== page ?
                            ( 
                            <li id={`page-${page}`} key={`page-${page}`} className="page-item">
                                <Link id={`page-link-${page}`} to={`?page=${page}`} className='page-link'>{page}</Link>
                            </li>
                            )
                            :
                            (
                            <li id={`page-${page}`} key={`page-${page}`} className="page-item disabled">
                                <Link id={`page-link-${page}`} to={`?page=${page}`} className='page-link'>{page}</Link>
                            </li>
                            )
                        ))}
                        <li id='next-page' className={`${nextPage}`}>
                            <Link id='next-page-link' to={`?page=${parseInt(currentPage)+1}`} className='page-link'>Next</Link>
                        </li>
                    </ul>
                </nav>}
            </div>

            <div className="custom-modal hidden" id="announcement-create-modal" style={{width: "50%"}} onClick={(e) => {e.stopPropagation();}}>
                <div className="custom-modal-header justify-content-center">                                
                    <h5 className='m-0'>Create announcement</h5>
                </div>
                <div className="custom-modal-body">
                    <hr className='m-1' />
                    <div className='d-flex align-items-center'>
                        {!userLoading && <ProfilePictureLazyLoader width={"3rem"} height={"3rem"} username={user.username}/>}
                        {!userLoading && <strong className='ms-2'>{user.username}</strong>}
                    </div>
                    <textarea id="announcement-title" className='input-field mt-2 textarea-expand w-100' rows={1} placeholder="Title..." data-category="input-field" onChange={(e) => {autoResizeTextarea(e.target)}} onInput={(e) => {handleAnnouncementTextChange(e)}}></textarea>
                    <textarea id="break-line-text" className='input-field mt-2 textarea-expand w-100' rows={1} placeholder="Text..." data-category="input-field" onChange={(e) => {autoResizeTextarea(e.target)}} onInput={(e) => {handleAnnouncementTitleChange(e)}}></textarea>
                </div>
                <div className="custom-modal-footer">
                    <button id="submit-data" className="btn btn-primary me-auto rounded-15" onClick={postAnnouncement}>Post announcement</button>
                </div>
            </div>
        </div>
        
    );
    
}