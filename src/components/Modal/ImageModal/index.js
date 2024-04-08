import React from 'react';
import classNames from 'classnames/bind';
import styles from './modalImage.module.scss';

const cx = classNames.bind(styles);

const ModalImage = ({ imageUrl, onClose }) => {
    return (
        <div className={cx('modal')}>
            <div className={cx('modal-content')}>
                <span className={cx('close')} onClick={onClose}>
                    &times;
                </span>
                <img src={imageUrl} alt="Modal Image" className={cx('image')} />
            </div>
        </div>
    );
};

export default ModalImage;
