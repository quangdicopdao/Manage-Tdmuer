import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import { faHouse, faCalendar, faFileInvoiceDollar, faQuoteLeft, faUsers } from '@fortawesome/free-solid-svg-icons';
import SidebarItem from './SidebarItem';
import { faBloggerB, faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

const Sidebar = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const location = useLocation();

    const [activeTab, setActiveTab] = useState(user?.isAdmin ? 'AdminPosts' : 'Home');

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    // Hàm kiểm tra xem đường dẫn có trùng khớp với tab hay không
    const isTabActive = (tabPath) => {
        return location.pathname === tabPath;
    };

    return (
        <div className={cx('wrapper')}>
            <ul className={cx('nav-list')}>
                {user?.isAdmin === false && (
                    <li>
                        <SidebarItem
                            icon={faHouse}
                            label="Trang chủ"
                            isActive={isTabActive('/')}
                            to={'/'}
                            onClick={() => handleTabClick('Home')}
                        />
                        <SidebarItem
                            icon={faCalendar}
                            label="Lịch"
                            isActive={isTabActive('/schedule')}
                            to={'/schedule'}
                            onClick={() => handleTabClick('Schedule')}
                        />
                        <SidebarItem
                            icon={faFacebookMessenger}
                            label="Chat"
                            isActive={isTabActive('/message')}
                            to={'/message'}
                            onClick={() => handleTabClick('Message')}
                        />
                        <SidebarItem
                            icon={faBloggerB}
                            label="Bài viết"
                            isActive={isTabActive('/post')}
                            to={'/post'}
                            onClick={() => handleTabClick('Post')}
                        />
                        <SidebarItem
                            icon={faFileInvoiceDollar}
                            label="Chi tiêu"
                            isActive={isTabActive('/spending')}
                            to={'/spending'}
                            onClick={() => handleTabClick('Spending')}
                        />
                    </li>
                )}
                {user?.isAdmin && (
                    <li>
                        <SidebarItem
                            icon={faQuoteLeft}
                            label={'Bài viết'}
                            isActive={isTabActive('/admin/posts')}
                            to={'/admin/posts'}
                            onClick={() => handleTabClick('AdminPost')}
                        />
                        <SidebarItem
                            icon={faUsers}
                            label={'Users'}
                            isActive={isTabActive('/admin/user')}
                            to={'/admin/posts'}
                            onClick={() => handleTabClick('AdminPost')}
                        />
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
