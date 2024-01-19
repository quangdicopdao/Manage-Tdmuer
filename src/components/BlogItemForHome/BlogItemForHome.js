import React from 'react';
import classNames from 'classnames/bind';
import style from './BlogItemForHome.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(style);

function BlogItemForHome({ title, imageUser, nameUser, content, to }) {
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
    const extractImageURL = (content) => {
        // Sử dụng biểu thức chính quy để tìm kiếm và trích xuất URL
        const regex = /<img.*?src=["'](https:\/\/i\.ibb\.co.*?)["']/;
        const match = content.match(regex);

        // Nếu có URL, trả về nó; ngược lại, trả về null
        return match ? match[1] : null;
    };

    const imageURL = extractImageURL(content);
    return (
        <Link to={to} className={cx('wrap-all')}>
            <div className={cx('wrapper')}>
                <img className={cx('image-post')} src={imageURL} alt="" />
                <h2 className={cx('text-title')}>{limitCharsPerLine(title, 30)}</h2>
                <div className={cx('wrap-post-info')}>
                    <img className={cx('image-user')} src={imageUser} alt={nameUser} />
                    <h4 className={cx('text-username')}>{nameUser}</h4>
                </div>
            </div>
        </Link>
    );
}

export default BlogItemForHome;
