import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind'; // Sửa đổi import
import style from './PostDetail.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarDays,
    faCheck,
    faChevronDown,
    faChevronUp,
    faClock,
    faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { faComment as faCommentRegular, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import { baseURL } from '~/utils/api';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import Modal from '~/components/Modal/Modal';
import {
    likePosts,
    unlikePosts,
    checkLike,
    createComment,
    getAllComments,
    joinActivity,
    checkJoinActivity,
    showListActivity,
    updateUrlImage,
} from '~/redux/apiRequest';
import { useSelector } from 'react-redux';
import Button from '~/components/Button';
import CustomTable from '~/components/Table/MyCustomTable/Table';
import ImageUploader from '~/components/ImageUploader';
import DefaultImage from '~/assets/no-image.jpg';

const cx = classNames.bind(style); // Sửa đổi cách sử dụng classNames.bind

function PostDetail() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [userPost, setUserPost] = useState(null);
    const user = useSelector((state) => state.auth.login?.currentUser);
    const [isLoading, setIsLoading] = useState(false);
    const [showModalUpload, setShowModalUpload] = useState(false);
    const handelShowModalUpload = () => {
        setShowModalUpload(!showModalUpload);
    };
    const [imageUpload, setImageUpload] = useState(false);
    console.log('imageUpload', imageUpload);
    const handleSaveUrlImage = () => {
        const data = {
            userId: user?._id,
            postId,
            url: imageUpload,
        };
        updateUrlImage(data, user?.accessToken);
        handelShowModalUpload();
    };
    const handleSetURL = (url) => {
        setImageUpload(url);
    };
    //join activity
    const handleJoinActivity = async () => {
        const data = {
            studentId: studentID,
            classId: className,
            fullName,
            department,
            email,
            start: post?.start,
            end: post?.end,
            userId: user?._id,
            postId,
            description: post?.title,
        };
        await joinActivity(data, user?.accessToken, setShowModal(!showModal));
    };
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
    const [studentID, setStudentID] = useState('');
    const [fullName, setFullName] = useState('');
    const [className, setClassName] = useState('');
    const [department, setDepartment] = useState('');
    const [email, setEmail] = useState('');

    const handleShowComment = async () => {
        setShowComment(!showComment);
        setIsLoading(true);
    };
    const [showModal, setShowModal] = useState(false);
    const handleShowRequest = () => {
        setShowModal(!showModal);
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
                userPost: userPost.username,
                idUserPost: userPost._id,
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
    const timeStart = post && moment(post.start).format('HH:mm');
    const timeEnd = post && moment(post.end).format('HH:mm');
    const dateStart = post && moment(post.start).format('DD/MM/YYYY');
    const dateEnd = post && moment(post.end).format('DD/MM/YYYY');

    //show list join
    const [showList, setShowList] = useState(false);
    const [dataList, setDataList] = useState([]);

    const handleShowList = async () => {
        setShowList(!showList);
        const data = await showListActivity(post?._id, user?.accessToken);
        setDataList(data?.list);
    };
    const columns = [
        { key: 'studentId', label: 'Mã số sinh viên' }, // Thêm cột chứa các chức năng
        { key: 'fullName', label: 'Họ và tên' },
        { key: 'email', label: 'Email' },
        { key: 'classId', label: 'Lớp' }, // Thêm cột chứa các chức năng
        { key: 'department', label: 'Khoa/Viện' }, // Thêm cột chứa các chức năng
        { key: 'imageUrl', label: 'Minh chứng', isImage: true, classNameImage: 'imageView' },
    ];
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
    const [checkActivity, setCheckActivity] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const data = {
                userId: user?._id,
                postId,
            };
            const dataCheck = await checkJoinActivity(data, user?.accessToken);
            setCheckActivity(dataCheck);
        };

        fetchData();
    }, []);
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
                    {post?.start && post?.end ? (
                        <div className={cx('wrap-all-time')}>
                            <span className={cx('title-time')}>Thời gian diễn ra:</span>
                            <div className={cx('wrap-time')}>
                                <FontAwesomeIcon icon={faClock} className={cx('icon-time')} />
                                <span>{`${timeStart} - ${timeEnd}`}</span>
                            </div>
                            <div className={cx('wrap-date')}>
                                <FontAwesomeIcon icon={faCalendarDays} className={cx('icon-time')} />
                                {dateStart === dateEnd ? (
                                    <span>{`${dateStart} `}</span>
                                ) : (
                                    <span>{`${dateStart} - ${dateEnd}`}</span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                    {user && post && user._id !== post.userId && (
                        <>
                            {post.start ? (
                                <>
                                    {checkActivity && checkActivity.message === 'joined' ? (
                                        <>
                                            <div className={cx('joined')}>
                                                <span className={cx('message')}>Bạn đã đăng ký tham gia</span>
                                                <FontAwesomeIcon icon={faCheck} className={cx('icon-message')} />
                                            </div>
                                            {user?._id !== post.userId ? (
                                                <Button
                                                    outline
                                                    className={cx('btn-join')}
                                                    onClick={handelShowModalUpload}
                                                >
                                                    Cập nhật minh chứng
                                                </Button>
                                            ) : (
                                                <></>
                                            )}

                                            <div>{/* <ImageUploader /> */}</div>
                                        </>
                                    ) : (
                                        <Button outline className={cx('btn-join')} onClick={handleShowRequest}>
                                            Tham gia hoạt động
                                        </Button>
                                    )}
                                </>
                            ) : null}
                        </>
                    )}

                    {user?._id === post.userId && post?.start && (
                        <Button primary className={cx('btn-join')} onClick={handleShowList}>
                            Xem danh sách tham gia
                        </Button>
                    )}
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
            {showModal && (
                <Modal
                    titleBtn={'Gửi yêu cầu'}
                    titleModal={'Đăng ký tham gia hoạt động'}
                    className={cx('modal-join')}
                    onClose={handleShowRequest}
                    onSave={handleJoinActivity}
                >
                    <div className={cx('modal-content')}>
                        <div className={cx('wrap-title-input')}>
                            <span className={cx('title')}>Mã số sinh viên</span>
                            <div className={cx('wrap-input')}>
                                <input
                                    type="text"
                                    value={studentID}
                                    placeholder="Nhập mã số sinh viên"
                                    onChange={(e) => setStudentID(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={cx('wrap-title-input')}>
                            <span className={cx('title')}>Họ và tên</span>
                            <div className={cx('wrap-input')}>
                                <input
                                    type="text"
                                    value={fullName}
                                    placeholder="Nhập họ và tên"
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={cx('wrap-title-input')}>
                            <span className={cx('title')}>Lớp</span>
                            <div className={cx('wrap-input')}>
                                <input
                                    type="text"
                                    value={className}
                                    placeholder="Nhập mã lớp"
                                    onChange={(e) => setClassName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={cx('wrap-title-input')}>
                            <span className={cx('title')}>Khoa / Viện</span>
                            <div className={cx('wrap-input')}>
                                <input
                                    type="text"
                                    value={department}
                                    placeholder="Nhập tên khoa / viện"
                                    onChange={(e) => setDepartment(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={cx('wrap-title-input')}>
                            <span className={cx('title')}>Email</span>
                            <div className={cx('wrap-input')}>
                                <input
                                    type="email"
                                    value={email}
                                    placeholder="Nhập email trường"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
            {showList && (
                <Modal
                    titleBtn={'Xuất file excel'}
                    titleModal={'Danh sách tham gia hoạt động'}
                    onClose={handleShowList}
                    className={cx('list-modal')}
                >
                    {dataList ? (
                        <div className={cx('wrap-content-list')}>
                            <CustomTable columns={columns} data={dataList} />
                        </div>
                    ) : (
                        <>
                            {' '}
                            <span>Chưa có thành viên tham gia</span>
                        </>
                    )}
                </Modal>
            )}
            {showModalUpload && (
                <Modal
                    titleBtn={'Xong'}
                    titleModal={'Cập nhật ảnh minh chứng'}
                    className={cx('modal-upload')}
                    onClose={handelShowModalUpload}
                    onSave={handleSaveUrlImage}
                >
                    {/* url={handleSetURL} */}
                    <ImageUploader imageUrl={handleSetURL}/>
                </Modal>
            )}
        </div>
    );
}

export default PostDetail;
