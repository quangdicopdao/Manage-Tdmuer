import React from 'react';
import classNames from 'classnames/bind';
import style from './UserChatComp.module.scss';
const cx = classNames.bind(style);

function UserChatComp({ imageUrl, name, lastMessage, isActive }) {
    return (
        <div className={cx('wrap-user-comp', { 'wrap-user-comp-active': isActive })}>
            <img className={cx('img-user')} src={imageUrl} alt={name} />
            <div className={cx('wrap-info')}>
                <h3 className={cx('name-user')}>{name}</h3>
                <h4 className={cx('last-message')}>{lastMessage}</h4>
            </div>
            <span className={cx('read-message-yet')}></span>
        </div>
    );
}

export default UserChatComp;
