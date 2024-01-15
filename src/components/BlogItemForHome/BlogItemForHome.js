import React from 'react';
import classNames from 'classnames/bind';
import style from './BlogItemForHome.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(style);

function BlogItemForHome({ title, imagePostUrl, imageUrl, nameUser, to }) {
    function limitCharsPerLine(inputString, charsPerLine) {
        const words = inputString.split(/\s+/);
        let currentLineChars = 0;
        let result = '';

        for (const word of words) {
            const expectedChars = currentLineChars + word.length + (currentLineChars > 0 ? 1 : 0);

            if (expectedChars <= charsPerLine) {
                result += (currentLineChars > 0 ? ' ' : '') + word;
                currentLineChars = expectedChars;
            } else {
                result += '...';
                break; // Thoát khỏi vòng lặp nếu đã thêm dấu ba chấm
            }
        }

        return result;
    }
    return (
        <Link to={to} className={cx('wrap-all')}>
            <div className={cx('wrapper')}>
                <img className={cx('image-post')} src={imagePostUrl} alt="" />
                <h2 className={cx('text-title')}>{limitCharsPerLine(title, 30)}</h2>
                <div className={cx('wrap-post-info')}>
                    <img className={cx('image-user')} src={imageUrl} alt={nameUser} />
                    <h4 className={cx('text-username')}>{nameUser}</h4>
                </div>
            </div>
        </Link>
    );
}

export default BlogItemForHome;
