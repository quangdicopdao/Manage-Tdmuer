import React from 'react';
import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function AccountItem({ searchResults }) {
    const limitedResults = searchResults && searchResults.slice(0, 4);
    console.log('limitedResults', limitedResults);

    return (
        <div>
            <ul className={cx('list-item')}>
                {limitedResults &&
                    limitedResults.map((result) => (
                        <li key={result.id}>
                            <Link to={`/profile/${result._id}`} className={cx('text-link')}>
                                <div className={cx('wrapper')}>
                                    <img className={cx('avatar')} src={result.avatar} alt={result.name || {}} />
                                    <div className={cx('content')}>
                                        <h4 className={cx('username')}>{result.username}</h4>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
            </ul>
        </div>
    );
}
export default AccountItem;