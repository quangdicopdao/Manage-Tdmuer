import React from 'react';
import classNames from 'classnames/bind';
import style from './BlogItemForHome.module.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(style);
function stripHTML(htmlString) {
    var doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
}

function BlogItemForHome({ title, imageUser, nameUser, content, to, createAt }) {
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

    const renderTextContent = (htmlString) => {
        const contentWithoutHTML = stripHTML(htmlString);
        return limitCharsPerLine(contentWithoutHTML, 150); // Adjust the character limit as needed
    };
    return (
        <div className={cx('wrapper')}>
            <Link to={to} className={cx('wrap-all-content')}>
                <img className={cx('image-post')} src={imageURL} alt="" />
                <div className={cx('wrap-content')}>
                    <div className={cx('wrap-title-content')}>
                        <h2 className={cx('text-title')}>{limitCharsPerLine(title, 30)}</h2>
                        <p className={cx('text-description')}>{renderTextContent(content)}</p>
                    </div>
                    <div className={cx('wrap-filter')}>
                        <span className={cx('title-type')}>Quân sự</span>
                        <span className={cx('title-type')}>Quân sự</span>
                        <span className={cx('title-type')}>Quân sự</span>
                        <span className={cx('title-type')}>Quân sự</span>
                    </div>
                </div>
            </Link>
            <div className={cx('wrap-post-info')}>
                {/* <img className={cx('image-user')} src={imageUser} alt={nameUser} />
                    <h4 className={cx('text-username')}>{nameUser}</h4> */}
                <FontAwesomeIcon icon={faBookmark} className={cx('icon-save')} />
                <span className={cx('time')}>{createAt}</span>
            </div>
        </div>
    );
}

export default BlogItemForHome;
