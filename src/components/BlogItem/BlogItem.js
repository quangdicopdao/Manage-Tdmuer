import React from 'react';
import classNames from 'classnames/bind';
import styles from './BlogItem.module.scss';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);

// BlogItem.jsx

function BlogItem({ searchResults }) {
    const limitedResults = searchResults && searchResults.slice(0, 4);
    console.log('limitedResults', limitedResults);
    // Lấy phần "/post/id" từ URL hiện tại
    const baseUrl = process.env.REACT_APP_BASE_URL || '';

    return (
        <div>
            <ul className={cx('list-item')}>
                {limitedResults &&
                    limitedResults.map((result) => (
                        <li key={result.id}>
                            <Link to={`${baseUrl}/post/${result._id}`} className={cx('text-link')}>
                                <div className={cx('wrapper')}>
                                    <img className={cx('avatar')} src={result.imageURL} alt="title" />
                                    <div className={cx('content')}>
                                        <h4 className={cx('username')}>{result.title}</h4>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default BlogItem;
