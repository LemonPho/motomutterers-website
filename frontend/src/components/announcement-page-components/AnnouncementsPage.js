import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Navigate, Link, useNavigate, useSearchParams } from 'react-router-dom';

import ApplicationContext, { useApplicationContext } from '../ApplicationContext';

import { getAnnouncements } from '../fetch-utils/fetchGet';
import { autoResizeTextarea, pagination } from '../utils';
import Modal from '../util-components/Modal';
import { useOpenersContext } from '../OpenersContext';
import CreateAnnouncementModal from './CreateAnnouncementModal';
import AnnouncementCard from './AnnouncementCard';

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
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    async function retrieveAnnouncements(){
        setAnnouncementsLoading(true);
        const announcementsResponse = await getAnnouncements(currentPage);
        if(announcementsResponse.error){
            setErrorMessage("There was an error while loading the announcements");
            return;
        }

        if(announcementsResponse.status === 404){
            setCurrentPage(1);
            navigate(`/announcements?page=1`, {replace: true});
            return;
        }

        setAnnouncements(announcementsResponse.announcements);
        setTotalAnnouncements(announcementsResponse.amountAnnouncements);
        setAnnouncementsLoading(false);
    }

    //when totalAnnouncements is asigned, we can generate the pagination necessary, no need to check if its 0, it will just generate a disabled pagination menu
    useEffect(() => {
        if(currentPage < 1) return;
        retrieveAnnouncements();
    }, [currentPage]);

    useEffect(() => {
        let result = pagination(totalAnnouncements, 10, currentPage);
        if(result !== null){
            setNextPage(result.nextPage);
            setPreviousPage(result.previousPage);
            setPageNumbers(result.pageNumbers);
            setPages(true);
        }    
    }, [totalAnnouncements, currentPage]);

    useEffect(() => {
        const page = searchParams.get("page");
        if(page === null){
            navigate(`/announcements?page=1`, {replace: true});
        } else if(parseInt(page) !== currentPage){
            setCurrentPage(parseInt(page));
        }
    }, [location.search]);

    if(announcementsLoading){
        return(
            <AnnouncementCard announcement={false} loading={true} maxHeight={"50vh"}/>
        )
    }

    return(
        <div className='card element-background-color element-border-color rounded-15 p-2'>
            <div className='card-header d-flex align-items-center nested-element-color rounded-15'>
                <h5>Announcements</h5>
                {(!userLoading && user.is_admin) && <button className='btn btn-primary ms-auto rounded-15' onClick={() => {openModal("announcement-create")}}>Create Announcement</button>}
            </div>
            <div className='card-body p-0'>
            {(!announcementsLoading && announcements.length != 0) && announcements.map((announcement) => (
                <div className='my-3' key={announcement.id}>
                    <AnnouncementCard announcement={announcement} loading={announcementsLoading} maxHeight={"50vh"}/>
                </div>
            ))}
            </div>
            {pages &&
            <div className='card-footer rounded-15 nested-element-color align-items-center'>
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
                </nav>
            </div>
            }
            <Modal isOpen={openedModal == "announcement-create"}>
                <CreateAnnouncementModal/>
            </Modal>
        </div>
        
    );
    
}