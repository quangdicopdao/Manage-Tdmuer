import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './BlogItemForHome.module.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import moment from 'moment';
import { useSelector } from 'react-redux';
import noImg from '~/assets/no-image.jpg';
const cx = classNames.bind(style);

function stripHTML(htmlString) {
    var doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
}

function BlogItemForHome({ title, imageUser, nameUser, postId, content, to, createAt, savePost }) {
    console.log('data', imageUser, nameUser);
    const [isSaved, setIsSaved] = useState(false);
    const user = useSelector((state) => state.auth.login.currentUser);
    const arrSavedPosts = user?.savedPosts;
    // format date post blog
    // format date post blog
    const formatPostDate = (date) => {
        const postDate = moment(date);
        const currentDate = moment();
        const diffDays = currentDate.diff(postDate, 'days');
        const diffMonths = currentDate.diff(postDate, 'months');
        const diffYears = currentDate.diff(postDate, 'years');

        if (diffDays < 1) {
            return 'Hôm nay';
        } else if (diffDays === 1) {
            return 'Hôm qua';
        } else if (diffDays < 30) {
            return `${diffDays} ngày trước`;
        } else if (diffMonths < 12) {
            return `${diffMonths} tháng trước`;
        } else {
            return `${diffYears} năm trước`;
        }
    };
    useEffect(() => {
        // Kiểm tra xem id của post có trong mảng arrSavedPosts không
        if (arrSavedPosts) {
            setIsSaved(arrSavedPosts.includes(postId));
        }
    }, [arrSavedPosts, postId]);

    console.log('setIsSaved', arrSavedPosts);

    const toggleSavePost = () => {
        setIsSaved(!isSaved);
        savePost(); // Gọi hàm lưu bài viết
    };

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
        return limitCharsPerLine(contentWithoutHTML, 200); // Adjust the character limit as needed
    };

    // // format date time
    // const formatDateTime = (dateDB) => {
    //     const date = moment(dateDB).format('DD/MM/YYYY');
    //     return date;
    // };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrap-content')}>
                <div className={cx('wrap-info')}>
                    <div className={cx('wrap-name-img')}>
                        <img src={imageUser ? imageUser : noImg} alt={nameUser} className={cx('img-user')} />
                        <span className={cx('name-user')}>{nameUser}</span>
                    </div>
                    <FontAwesomeIcon
                        icon={isSaved ? faBookmark : faBookmarkRegular}
                        className={cx('icon-save', { saved: isSaved })}
                        onClick={toggleSavePost}
                    />
                </div>
                <Link to={to} className={cx('wrap-all-content')}>
                    <div className={cx('wrap-title-content')}>
                        <h2 className={cx('text-title')}>{limitCharsPerLine(title, 30)}</h2>
                        <p className={cx('text-description')}>{renderTextContent(content)}</p>
                    </div>
                    <img className={cx('image-post')} src={imageURL} alt="" />
                </Link>

                <div className={cx('wrap-filter')}>
                    <span className={cx('title-type')}>Quân sự</span>
                    <span className={cx('time')}>{formatPostDate(createAt)}</span>
                </div>
            </div>
        </div>
    );
}

export default BlogItemForHome;
