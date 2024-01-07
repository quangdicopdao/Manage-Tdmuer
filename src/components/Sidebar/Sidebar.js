import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import { faHouse, faCalendar } from '@fortawesome/free-solid-svg-icons';
import SidebarItem from './SidebarItem';
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';

const cx = classNames.bind(styles);

const Sidebar = () => {
    const [activeTab, setActiveTab] = useState('Home');

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <div className={cx('wrapper')}>
            <ul className={cx('nav-list')}>
                <SidebarItem
                    icon={faHouse}
                    label="Trang chủ"
                    isActive={activeTab === 'Home'}
                    to={'/'}
                    onClick={() => handleTabClick('Home')}
                />

                <SidebarItem
                    icon={faCalendar}
                    label="Lịch"
                    isActive={activeTab === 'Schedule'}
                    to={'/schedule'}
                    onClick={() => handleTabClick('Schedule')}
                />
                <SidebarItem
                    icon={faFacebookMessenger}
                    label="Chat"
                    isActive={activeTab === 'Message'}
                    to={'/message'}
                    onClick={() => handleTabClick('Message')}
                />
            </ul>
        </div>
    );
};

export default Sidebar;
