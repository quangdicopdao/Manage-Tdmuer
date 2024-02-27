import React from 'react';
import classNames from 'classnames/bind';
import style from './Pagination.module.scss';

const cx = classNames.bind(style);

function Pagination({ currentPage, totalPages, onPageChange }) {
    // Nếu không có trang nào, không hiển thị thanh phân trang
    if (totalPages === 0) {
        return null;
    }

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <div className={cx('wrapper')}>
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                Trước
            </button>
            {pages.map((page) => (
                <button key={page} onClick={() => onPageChange(page)} className={cx({ active: page === currentPage })}>
                    {page}
                </button>
            ))}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Sau
            </button>
        </div>
    );
}

export default Pagination;
