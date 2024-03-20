import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind'; // Sửa đổi import
import style from './PostDetail.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faHeart, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faComment as faCommentRegular, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import { baseURL } from '~/utils/api';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import Modal from '~/components/Modal/Modal';
import { likePosts, unlikePosts, checkLike, createComment, getAllComments } from '~/redux/apiRequest';
import { useSelector } from 'react-redux';
import Button from '~/components/Button';
const cx = classNames.bind(style); // Sửa đổi cách sử dụng classNames.bind

function PostDetail() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [userPost, setUserPost] = useState(null);
    const user = useSelector((state) => state.auth.login?.currentUser);
    const [isLoading, setIsLoading] = useState(false);
    console.log('post', post);

    //like post
    const [isLiked, setIsLiked] = useState(false);
    const [countLikes, setCountLikes] = useState(0);
    const [countComments, setCountComments] = useState(0);
    const handleLikePost = async () => {
        try {
            // Người dùng chưa đăng nhập, không thực hiện like/unlike
            if (!user) return;

            const data = {
                postId,
                userId: user._id,
            };

            if (isLiked) {
                await unlikePosts(data, postId);
                setCountLikes(countLikes - 1);
                setIsLiked(false);
            } else {
                await likePosts(data);
                setCountLikes(countLikes + 1);
                setIsLiked(true);
            }
        } catch (error) {
            console.error('Error liking/unliking post:', error);
        }
    };

    //comment post
    const [showComment, setShowComment] = useState(false);
    const [comment, setComment] = useState('');
    const [dataComment, setDataComment] = useState([]);
    const [toggleShowMoreComment, setToggleShowMoreComment] = useState({});

    const [replyingToCommentId, setReplyingToCommentId] = useState(null);

    console.log('comment', comment);
    console.log('dâtcomment', dataComment);

    //reply comment

    const handleShowReplyComment = (commentId) => {
        setToggleShowMoreComment((prevStates) => ({
            ...prevStates,
            [commentId]: !prevStates[commentId],
        }));
    };
    const handleShowInput = (commentId) => {
        setReplyingToCommentId(commentId);
    };

    const handleReply = async (parentId) => {
        console.log('reply', parentId);
        try {
            if (!user) return;
            const data = {
                postId,
                userId: user._id,
                content: comment,
                parentId,
            };
            await createComment(data);
            setReplyingToCommentId('');
            setIsLoading(true);
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };
    const handleShowComment = async () => {
        setShowComment(!showComment);
        setIsLoading(true);
    };

    const handleCommentPost = async () => {
        try {
            // Kiểm tra xem người dùng đã đăng nhập chưa
            if (!user) {
                // Xử lý logic nếu người dùng chưa đăng nhập
                return; // Hoặc hiển thị thông báo lỗi cho người dùng
            }

            // Tạo dữ liệu bình luận từ các trường thông tin
            const data = {
                postId: postId, // postId đã được định nghĩa ở nơi khác trong phạm vi của hàm này
                userId: user._id, // user đã được xác định trước đó trong phạm vi của hàm này
                content: comment, // comment là nội dung bình luận từ người dùng
            };

            // Gửi yêu cầu tạo mới bình luận thông qua hàm createComment
            await createComment(data);
            setComment('');
            setIsLoading(true);
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Error creating comment:', error);
            // Hiển thị thông báo lỗi cho người dùng nếu cần
        }
    };

    const hanldeCancleComment = () => {
        setComment('');
    };
    //render html to normal text
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

                // Kiểm tra lượt thích của người dùng cho bài viết hiện tại
                const data = {
                    postId,
                    userId: user._id,
                };
                console.log('userId', user._id);
                const isLikedResponse = await checkLike(data); // Assumed checkLike accepts postId as argument
                setIsLiked(isLikedResponse.liked);
                setCountLikes(isLikedResponse.likeCount);
                setCountComments(isLikedResponse.commentCount);
            } catch (error) {
                console.error('Error fetching post detail:', error);
            }
        };

        fetchPostDetail();
    }, [postId]);

    useEffect(() => {
        const textarea = document.getElementById('comment-textarea');
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
    }, [comment]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // get comments
                const getDataComment = await getAllComments(postId);
                setDataComment(getDataComment);
                console.log('comment123', getDataComment);
                setIsLoading(false); // Sau khi nhận được dữ liệu, setIsLoading(false) để kết thúc việc loading
            } catch (error) {
                console.error('Error fetching comments:', error);
                setIsLoading(false); // Trong trường hợp lỗi, cũng cần setIsLoading(false) để kết thúc việc loading
            }
        };

        // Chỉ gọi fetchData khi isLoading là true
        if (isLoading) {
            fetchData();
        }
    }, [isLoading]); // Dependency chỉ là isLoading, không cần phụ thuộc vào dataComment nữa

    if (!post) {
        return <div>Loading...</div>;
    }
    const renderCommentInput = (ReplyOrCreate) => {
        return (
            <div className={cx('wrap-input-comment')}>
                <div className={cx('wrap-img-input')}>
                    <img src={user.avatar} alt="" className={cx('img-user-input')} />
                    <div className={cx('wrap-input')}>
                        <textarea
                            id="comment-textarea"
                            placeholder="Nhập bình luận của bạn"
                            className={cx('input-comment')}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                </div>
                {comment.length > 0 && (
                    <div className={cx('wrap-btn')}>
                        <Button className={cx('btn-cancle')} onClick={hanldeCancleComment}>
                            Hủy
                        </Button>
                        <Button className={cx('btn-submit')} onClick={ReplyOrCreate}>
                            Bình luận
                        </Button>
                    </div>
                )}
            </div>
        );
    };

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
                                onClick={() => handleLikePost(post._id)}
                            />
                            <span className={cx('count')}>{countLikes}</span>
                        </div>

                        <div className={cx('wrap-btn')}>
                            <FontAwesomeIcon
                                icon={faCommentRegular}
                                className={cx('btn-icon')}
                                onClick={handleShowComment}
                            />

                            <span className={cx('count')}>{countComments}</span>
                        </div>
                    </div>
                    <Button outline className={cx('btn-join')}>
                        Tham gia hoạt động
                    </Button>
                </div>
            </div>
            {showComment && (
                <Modal
                    titleModal={'Bình luận của bài viết'}
                    onClose={handleShowComment}
                    className={cx('modal', { opened: showComment })}
                >
                    {renderCommentInput(handleCommentPost)}

                    {/*comment parents*/}
                    {dataComment.map(
                        (comment) =>
                            comment.comment.parentId === null && (
                                <div className={cx('comment-root')} key={comment._id}>
                                    <div className={cx('wrap-all-comment')}>
                                        {comment.user && comment.user.avatar && (
                                            <img src={comment.user.avatar} alt="" className={cx('img-user')} />
                                        )}
                                        <div className={cx('wrap-all-info')}>
                                            <div className={cx('wrap-content-comment')}>
                                                <span className={cx('name-comment')}>{comment.user.username}</span>
                                                <span className={cx('content-comment')}>{comment.comment.content}</span>
                                            </div>
                                            <div className={cx('action-comment')}>
                                                <span className={cx('like')}>Thích</span>
                                                <span
                                                    className={cx('comment')}
                                                    onClick={() => handleShowInput(comment.comment._id)}
                                                >
                                                    Trả lời
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {dataComment.some((reply) => reply.comment.parentId === comment.comment._id) && (
                                        <div
                                            className={cx('more-comment')}
                                            onClick={() => handleShowReplyComment(comment.comment._id)}
                                        >
                                            <span className={cx('hide-show')}>
                                                {toggleShowMoreComment[comment.comment._id]
                                                    ? 'Ẩn câu trả lời'
                                                    : 'Xem câu trả lời'}
                                            </span>
                                            <FontAwesomeIcon
                                                icon={
                                                    toggleShowMoreComment[comment.comment._id]
                                                        ? faChevronUp
                                                        : faChevronDown
                                                }
                                                className={cx('icon-hide-show')}
                                            />
                                        </div>
                                    )}
                                    {/* Hiển thị các phản hồi của bình luận cha */}
                                    {toggleShowMoreComment[comment.comment._id] &&
                                        dataComment.map(
                                            (reply) =>
                                                reply.comment.parentId === comment.comment._id && (
                                                    <div className={cx('comment-chilren')} key={reply._id}>
                                                        {/* Hiển thị thông tin của người phản hồi */}
                                                        <div className={cx('wrap-all-comment')}>
                                                            <img
                                                                src={reply.user.avatar}
                                                                alt=""
                                                                className={cx('img-user')}
                                                            />

                                                            <div className={cx('wrap-all-info')}>
                                                                <div className={cx('wrap-content-comment')}>
                                                                    <span className={cx('name-comment')}>
                                                                        {reply.user.username}
                                                                    </span>
                                                                    <span className={cx('content-comment')}>
                                                                        {reply.comment.content}
                                                                    </span>
                                                                </div>
                                                                <div className={cx('action-comment')}>
                                                                    <span className={cx('like')}>Thích</span>
                                                                    <span
                                                                        className={cx('comment')}
                                                                        onClick={() =>
                                                                            handleShowInput(comment.comment._id)
                                                                        }
                                                                    >
                                                                        Trả lời
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                        )}
                                    {replyingToCommentId === comment.comment._id &&
                                        renderCommentInput(() => handleReply(comment.comment._id))}
                                </div>
                            ),
                    )}

                    {/*comment actions*/}
                </Modal>
            )}
        </div>
    );
}

export default PostDetail;
