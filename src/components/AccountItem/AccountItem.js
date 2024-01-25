import React from 'react';
import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';

const cx = classNames.bind(styles);

function AccountItem({ searchResults }) {
    const limitedResults = searchResults.slice(0, 4);

    return (
        <div>
            <ul>
                {limitedResults.map((result) => (
                    <li key={result.id}>
                        <div className={cx('wrapper')}>
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
