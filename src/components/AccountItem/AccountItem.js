import React from 'react';
import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';
<<<<<<< HEAD
import { Link } from 'react-router-dom'; 
=======
import { Link } from 'react-router-dom';

>>>>>>> 6523241514395d6ff5ecb2e4232c09dc7f8e99da
const cx = classNames.bind(styles);

function AccountItem({ searchResults, onAccountItemClick }) {
    const limitedResults = searchResults.slice(0, 4);
    return (
        <div>
            <ul className={cx('list-item')}>
                {limitedResults.map((result) => (
                    <li key={result.id}>
<<<<<<< HEAD
                        <div onClick={() => onAccountItemClick(result)} className={cx('wrapper')}>
                            <img className={cx('avatar')} src={result.avatar} alt={result.name} />
                            <div className={cx('content')}>
                                <h4 className={cx('username')}>{result.username}</h4>
=======
                        <Link to={`/profile/${result._id}`} className={cx('text-link')}>
                            <div className={cx('wrapper')}>
                                <img className={cx('avatar')} src={result._doc.avatar} alt={result._doc.name} />
                                <div className={cx('content')}>
                                    <h4 className={cx('username')}>{result._doc.username}</h4>
                                </div>
>>>>>>> 6523241514395d6ff5ecb2e4232c09dc7f8e99da
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AccountItem;
