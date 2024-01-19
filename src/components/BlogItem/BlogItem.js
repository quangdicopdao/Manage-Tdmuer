import React from 'react';
import classNames from 'classnames/bind';
import styles from './BlogItem.module.scss';

const cx = classNames.bind(styles);

// BlogItem.jsx

function BlogItem({ searchResults }) {
    const limitedResults = searchResults.slice(0, 4);
    console.log(limitedResults); // Kiểm tra dữ liệu ở đây

    return (
        <div>
            <ul>
                {limitedResults.map((result) => (
                    <li key={result.id}>
                        <div className={cx('wrapper')}>
                            <img className={cx('avatar')} src={result.imageURL} alt="title" />
                            <div className={cx('content')}>
                                <h4 className={cx('username')}>{result.title}</h4>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BlogItem;
