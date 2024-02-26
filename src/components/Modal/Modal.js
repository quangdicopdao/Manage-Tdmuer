// Modal.jsx
import React from 'react';
import classNames from 'classnames/bind';
import styles from './Modal.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';

const cx = classNames.bind(styles);

const Modal = ({ onClose, children, titleModal, titleBtn, onSave, className }) => (
    <div className={cx('modal-overlay')} onClick={onClose}>
        <div className={cx('modal-wrapper', className)} onClick={(e) => e.stopPropagation()}>
            {titleModal && (
                <div className={cx('modal-header-content')}>
                    <h2 className={cx('title-modal')}>{titleModal}</h2>
                    <button className={cx('btn-close')} onClick={onClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
            )}
            <div className={cx('modal-body-content')}>{children}</div>
            {titleBtn && (
                <div className={cx('modal-footer-content')}>
                    <Button primary onClick={onSave}>
                        {titleBtn}
                    </Button>
                </div>
            )}
        </div>
    </div>
);

export default Modal;
