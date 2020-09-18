import React from 'react'

export const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
    const pageNumbers = []

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i)
    }

    return (
        <ul className="pagination " style={{ paddingLeft: '40%' }} >
            {pageNumbers.map((item, index) => (<li
                className={currentPage === item ? 'active activeColor' : 'waves-effect'}
                key={index}
                style={{ border: '1px solid black' }}>
                <a href="!#"
                    onClick={(event) => paginate(item, event)}>{item}</a></li>))}
        </ul>
    )
}