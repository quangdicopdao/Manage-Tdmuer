// Modal.jsx
import React from 'react';
import classNames from 'classnames/bind';
import styles from './Modal.module.scss';

const cx = classNames.bind(styles);

const Modal = ({ onClose, children }) => (
    <div className={cx('modal-overlay')} onClick={onClose}>
        <div className={cx('modal-content')} onClick={(e) => e.stopPropagation()}>
            {children}
        </div>
    </div>
);

export default Modal;
