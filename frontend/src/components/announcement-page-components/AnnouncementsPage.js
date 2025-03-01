import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';

import ApplicationContext, { useApplicationContext } from '../ApplicationContext';

import { getAnnouncements } from '../fetch-utils/fetchGet';
import { submitAnnouncement } from '../fetch-utils/fetchPost';
import { autoResizeTextarea, pagination } from '../utils';
import ProfilePictureLazyLoader from '../util-components/ProfilePictureLazyLoader';
import Modal from '../util-components/Modal';
import { useOpenersContext } from '../OpenersContext';
import CreateAnnouncementModal from './CreateAnnouncementModal';

export default function Anouncements(){
    const [announcements, setAnnouncements] = useState([]);
    const [announcementsLoading, setAnnouncementsLoading] = useState(true);

    const [totalAnnouncements, setTotalAnnouncements] = useState(0);

    const {user, userLoading, setErrorMessage, setSuccessMessage, resetApplicationMessages, setLoadingMessage} = useApplicationContext();
    const {openedModal, openModal} = useOpenersContext();

    const [pages, setPages] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [previousPage, setPreviousPage] = useState("");
    const [nextPage, setNextPage] = useState("");
    const [pageNumbers, setPageNumbers] = useState([]);

    const location = useLocation();

    async function retrieveAnnouncements(){
        setAnnouncementsLoading(true);
        const params = new URLSearchParams(location.search);
        let page = parseInt(params.get("page"));
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

    useEffect(() => {
        retrieveAnnouncements();
    }, [location.search]);

    //when totalAnnouncements is asigned, we can generate the pagination necessary, no need to check if its 0, it will just generate a disabled pagination menu
    useEffect(() => {
        console.log("setting pagination");
        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get("page"));
        setCurrentPage(page);

        let result = pagination(totalAnnouncements, 10, page);
        if(result !== null){
            setNextPage(result.nextPage);
            setPreviousPage(result.previousPage);
            setPageNumbers(result.pageNumbers);
            setPages(true);
        }
        
    }, [totalAnnouncements, location.search]);

    return(
        <div className='card element-background-color element-border-color rounded-15'>
            <div className='card-header d-flex align-items-center'>
                <h5>Announcements</h5>
                {(!userLoading && user.is_admin) && <button className='btn btn-primary ms-auto rounded-15' onClick={() => {openModal("announcement-create")}}>Create Announcement</button>}
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
                            <Link id='previous-page-link' to={`?page=${currentPage-1}`} className='page-link'>Previous</Link>
                        </li>
                        {pageNumbers.map((page) => (
                            currentPage !== page ?
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
                            <Link id='next-page-link' to={`?page=${currentPage+1}`} className='page-link'>Next</Link>
                        </li>
                    </ul>
                </nav>}
            </div>
            <Modal isOpen={openedModal == "announcement-create"}>
                <CreateAnnouncementModal/>
            </Modal>
        </div>
        
    );
    
}