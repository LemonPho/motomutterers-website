import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CommentsPages({ amountComments, currentPage }){
    if(amountComments <= 15) return null;

    const [pageNumbers, setPageNumbers] = useState(1);
    const [previousPage, setPreviousPage] = useState("page-item disabled");
    const [nextPage, setNextPage] = useState("page-item disabled")

    function calculatePages(){
        let tempPageNumbers = parseInt(amountComments/15)
    
        if(amountComments%15 != 0){
            tempPageNumbers++;
        }

        setPreviousPage(currentPage <= 1 ? "page-item disabled" : "page-item");
        setNextPage(currentPage >= tempPageNumbers ? "page-item disabled": "page-item");
        setPageNumbers(tempPageNumbers);
    }

    useEffect(() => {
        calculatePages();
    }, [currentPage])

    return(
        <nav id="pagination-view">
            <ul className='pagination justify-content-center'>
                <li id='previous-page' className={`${previousPage}`}>
                    <Link id='previous-page-link' to={`?page=${currentPage-1}`} className='page-link'>Previous</Link>
                </li>
                {Array.from({ length: pageNumbers }, (_, i) => i + 1).map((page) => (
                    (parseInt(currentPage) == parseInt(page) ? (
                    <li id={`page-${page}`} key={`page-${page}`} className="page-item disabled">
                        <Link id={`page-link-${page}`} to={`?page=${page}`} className="page-link">
                            {page}
                        </Link>
                    </li>
                    ) : (
                    <li id={`page-${page}`} key={`page-${page}`} className="page-item">
                        <Link id={`page-link-${page}`} to={`?page=${page}`} className="page-link">
                            {page}
                        </Link>
                    </li>
                    ))))}
                <li id='next-page' className={`${nextPage}`}>
                    <Link id='next-page-link' to={`?page=${parseInt(currentPage)+1}`} className='page-link'>Next</Link>
                </li>
            </ul>
        </nav>
    )
}