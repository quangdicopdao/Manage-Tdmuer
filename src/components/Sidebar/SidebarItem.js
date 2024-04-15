// SidebarItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

const SidebarItem = ({ icon, label, to, isActive, onClick }) => (
    <div className={cx('list-item', { 'list-item-active': isActive })} onClick={onClick}>
        <Link to={to}>
            <FontAwesomeIcon icon={icon} />
            <h4>{label}</h4>
        </Link>
    </div>
);

export default SidebarItem;
