import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind'; // Sửa đổi import
import style from './PostDetail.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faComment as faCommentRegular, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import { baseURL } from '~/utils/api';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import Modal from '~/components/Modal/Modal';
const cx = classNames.bind(style); // Sửa đổi cách sử dụng classNames.bind

function PostDetail() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [userPost, setUserPost] = useState(null);
    console.log('post', post);

    //like post
    const [isLiked, setIsLiked] = useState(false);
    const [countLikes, setCountLikes] = useState(0);
    const handleLikePost = () => {
        setIsLiked(!isLiked);
        // gọi api ở đây để update countLikes
        !isLiked ? setCountLikes(countLikes + 1) : setCountLikes(countLikes - 1);
    };

    //comment post
    const [showComment, setShowComment] = useState(false);

    const handleShowComment = () => {
        setShowComment(!showComment);
    };
    const renderHTML = (htmlString) => {
        return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
    };

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
        const fetchPostDetail = async () => {
            try {
                const response = await axios.get(baseURL + `post/detail/${postId}`);
                setPost(response.data.post);
                setUserPost(response.data.user);
            } catch (error) {
                console.error('Error fetching post detail:', error);
            }
        };

        fetchPostDetail();
    }, [postId]);

    if (!post) {
        return <div>Loading...</div>;
    }
    return (
        <div className={cx('wrapper')}>
            <div className={cx('row')}>
                <div className={cx('col-7')}>
                    <div className={cx('wrap-content')}>
                        <h2 className={cx('title-content')}>{post.title} </h2>
                        <div className={cx('content')}>{renderHTML(post.content)}</div>
                    </div>
                </div>
                <div className={cx('col-3')}>
                    <div className={cx('wrap-user')}>
                        <img className={cx('img-user')} src={userPost.avatar} />
                        <div className={cx('wrap-info')}>
                            <h3 className={cx('name-user')}>{userPost.username}</h3>
                            <h4 className={cx('date-post')}>{formatPostDate(post.createdAt)}</h4>
                        </div>
                    </div>
                    <div className={cx('wrap-action')}>
                        <div className={cx('wrap-btn')}>
                            <FontAwesomeIcon
                                icon={isLiked ? faHeart : faHeartRegular}
                                className={cx('btn-icon', { liked: isLiked })}
                                onClick={handleLikePost}
                            />
                            <span className={cx('count')}>{post.like || countLikes}</span>
                        </div>

                        <div className={cx('wrap-btn')}>
                            <FontAwesomeIcon
                                icon={faCommentRegular}
                                className={cx('btn-icon')}
                                onClick={handleShowComment}
                            />

                            <span className={cx('count')}>{post.comment || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
            {showComment && (
                <Modal
                    titleModal={'Bình luận của bài viết'}
                    onClose={handleShowComment}
                    className={cx('modal', { opened: showComment })}
                >
                    {/*comment parents*/}
                    <div className={cx('comment-root')}>
                        <img
                            src="https://cdn.oneesports.vn/cdn-data/sites/4/2023/11/cktg-lmht-t1-faker-win-four.jpg"
                            alt=""
                            className={cx('img-user')}
                        />
                        <div className={cx('wrap-all-info')}>
                            <div className={cx('wrap-content-comment')}>
                                <span className={cx('name-comment')}>Đặng Việt Quang</span>
                                <span className={cx('content-comment')}>
                                    Bài viết hay lắm bro aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                                </span>
                            </div>
                            <div className={cx('action-comment')}>
                                <span className={cx('like')}>Thích</span>
                                <span className={cx('comment')}>Trả lời</span>
                            </div>
                        </div>
                    </div>
                    {/*comment actions*/}

                    <div className={cx('more-comment')}>
                        <span className={cx('hide-show')}>Xem câu trả lời</span>
                        <FontAwesomeIcon icon={faChevronDown} className={cx('icon-hide-show')} />
                    </div>

                    {/*comment children*/}
                    <div className={cx('comment-chilren')}>
                        <img
                            src="https://cdn.oneesports.vn/cdn-data/sites/4/2023/11/cktg-lmht-t1-faker-win-four.jpg"
                            alt=""
                            className={cx('img-user')}
                        />
                        <div className={cx('wrap-all-info')}>
                            <div className={cx('wrap-content-comment')}>
                                <span className={cx('name-comment')}>Đặng Việt Quang</span>
                                <span className={cx('content-comment')}>
                                    Bài viết hay lắm bro aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                                </span>
                            </div>
                            <div className={cx('action-comment')}>
                                <span className={cx('like')}>Thích</span>
                                <span className={cx('comment')}>Trả lời</span>
                            </div>
                        </div>
                    </div>
                    {/*comment actions*/}
                </Modal>
            )}
        </div>
    );
}

export default PostDetail;
