import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

import ApplicationContext, { useApplicationContext } from './ApplicationContext';

import { getAnnouncements } from './fetch-utils/fetchGet';
import { submitAnnouncement } from './fetch-utils/fetchPost';
import { closeModals, pagination, toggleModal } from './utils';

export default function Anouncements(){
    const [announcements, setAnnouncements] = useState([]);
    const [announcementsLoading, setAnnouncementsLoading] = useState(true);

    const [totalAnnouncements, setTotalAnnouncements] = useState(0);
    const [announcementCreationLoading, setAnnouncementCreationLoading] = useState(false);

    const {user, contextLoading, setErrorMessage, modalErrorMessage, setModalErrorMessage, setSuccessMessage, resetApplicationMessages} = useApplicationContext();

    const [pages, setPages] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [previousPage, setPreviousPage] = useState("");
    const [nextPage, setNextPage] = useState("");
    const [pageNumbers, setPageNumbers] = useState([]);
    const [paginationLoading, setPaginationLoading] = useState(true);

    const location = useLocation();

    async function retrieveAnnouncements(){
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
        
        setPaginationLoading(false);
    }, [totalAnnouncements]);

    async function postAnnouncement(){
        setAnnouncementCreationLoading(true);
        resetApplicationMessages();
        if(!user.is_admin){
            setModalErrorMessage("You do not have permission to do that");
            setAnnouncementCreationLoading("false");
            closeModals();
            return;
        }

        let title = document.getElementById("announcement-title").innerHTML;
        let text = document.getElementById("break-line-text").innerHTML;

        const announcementResponse = await submitAnnouncement(title, text);

        if(announcementResponse.error){
            setModalErrorMessage("There was an error submiting the announcement");
            setAnnouncementCreationLoading(false);
            return;
        }

        if(announcementResponse.status === 400){
            setModalErrorMessage("Be sure the title has less than 128 characters and the text 2048 characters");
            setAnnouncementCreationLoading(false);
            return;
        }

        if(announcementResponse.status === 200){
            setSuccessMessage("Announcement posted");
            retrieveAnnouncements();
            closeModals();
            return;
        }

        setModalErrorMessage("There was a server error while submiting the announcement");
        return;
    }

    useEffect(() => {
        retrieveAnnouncements();
        setAnnouncementsLoading(false);
    }, [])

    if(announcementsLoading || paginationLoading || contextLoading) {
        return(
            <div>Loading...</div>
        );
    } else {
        return(
            <div>
                {user.is_admin === true && 
                <div className='d-flex justify-content-center mt-3'>
                    <button id="announcement-button" className='btn btn-primary rounded-15' onClick={(e) => toggleModal("announcement-create-modal", e, undefined, user.is_admin)}>Create announcement</button>
                    <div className="custom-modal hidden" id="announcement-create-modal" style={{width: "50%"}} onClick={(e) => {e.stopPropagation();}}>
                        <div className="custom-modal-header justify-content-center">                                
                            <h5 className='m-0'>Create announcement</h5>
                        </div>
                        <div className="custom-modal-body">
                            <hr className='m-1' />
                            {announcementCreationLoading && <div className='alert alert-secondary'><small>Loading...</small></div>}
                            {modalErrorMessage && <div className="alert alert-danger"><small>{modalErrorMessage}</small></div>}
                            <div className='d-flex align-items-center'>
                                <img className="rounded-circle" style={{width: "3rem", height: "3rem", marginRight: "0.5rem"}} src={`data: image/${user.profile_picture_format}; base64, ${user.profile_picture_data}`} alt=''/>
                                <strong>{user.username}</strong>
                            </div>
                            <div id="announcement-title" className='input-field mt-2' contentEditable={true} data-placeholder="Title..." data-category="input-field"></div>
                            <div id="break-line-text" className='input-field mt-2' contentEditable={true} data-placeholder="Text..." data-category="input-field"></div>
                        </div>
                        <div className="custom-modal-footer">
                            <button id="submit-data" className="btn btn-primary me-auto rounded-15" onClick={postAnnouncement}>Post announcement</button>
                        </div>
                    </div>
                </div>}
    
                <div id='announcements-view'>
                    {announcements.length == 0 && 
                    <div>
                        No announcements posted yet.    
                    </div>}
                    {announcements.lenght != 0 && announcements.map((announcement) => (
                        <div className="clickable card mx-auto my-3 rounded-15 w-100" key={announcement.id}>
                            <a className='link-no-decorations' href={`/announcements/${announcement.id}`}>
                                <div className='p-3' id={`announcement-${announcement.id}`}>
                                    <div className='d-flex'>
                                        <small>
                                            <img className="rounded-circle" style={{width: "2rem", height: "2rem", marginRight: "0.5rem"}} src={`data: image/${announcement.user.profile_picture_format}; base64, ${announcement.user.profile_picture_data}`} alt=''/>
                                            {announcement.user.username}
                                        </small>
                                        <small className='ms-auto'>{new Date(announcement.date_created).toISOString().substring(0,10)}</small>
                                    </div>
                                    
                                    <div className='d-flex w-100'>
                                        <h5 className='mt-1'>{announcement.title}</h5>
                                    </div>
                                    
                                    <hr className='mt-2 mb-1'/>
                                    <p>{announcement.text}</p>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
                {pages && 
                <nav id="pagination-view">
                    <ul className='pagination justify-content-center'>
                        <li id='previous-page' className={`${previousPage}`}>
                            <a id='previous-page-link' href={`announcements?page=${parseInt(currentPage)-1}`} className='page-link'>Previous</a>
                        </li>
                        {pageNumbers.map((page) => (
                            parseInt(currentPage) !== page ?
                            ( 
                            <li id={`page-${page}`} key={`page-${page}`} className="page-item">
                                <a id={`page-link-${page}`} href={`announcements?page=${page}`} className='page-link'>{page}</a>
                            </li>
                            )
                            :
                            (
                            <li id={`page-${page}`} key={`page-${page}`} className="page-item disabled">
                                <a id={`page-link-${page}`} href={`announcements?page=${page}`} className='page-link'>{page}</a>
                            </li>
                            )
                        ))}
                        <li id='next-page' className={`${nextPage}`}>
                            <a id='next-page-link' href={`announcements?page=${parseInt(currentPage)+1}`} className='page-link'>Next</a>
                        </li>
                    </ul>
                </nav>
                }
            </div>
        );
    }
}