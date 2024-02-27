import React from 'react';
import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';
import { Link } from 'react-router-dom'; 
const cx = classNames.bind(styles);

function AccountItem({ searchResults, onAccountItemClick }) {
    const limitedResults = searchResults.slice(0, 4);
    return (
        <div>
            <ul>
                {limitedResults.map((result) => (
                    <li key={result.id}>
                        <div onClick={() => onAccountItemClick(result)} className={cx('wrapper')}>
                            <img className={cx('avatar')} src={result.avatar} alt={result.name} />
                            <div className={cx('content')}>
                                <h4 className={cx('username')}>{result.username}</h4>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AccountItem;
