import React from 'react';
import classNames from 'classnames/bind';
import style from './Footer.module.scss';

const cx = classNames.bind(style);

const Footer = () => {
    return (
        <footer className={cx('footer-container')}>
            <div className={cx('footer-content')}>
                <p>&copy; 2024 Your Company. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
