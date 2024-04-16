import classNames from 'classnames/bind';
import style from './Me.moudule.scss';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPen } from '@fortawesome/free-solid-svg-icons';
import imgbg from '../../assets/background-img.jpeg';
import BlogItemForHome from '~/components/BlogItemForHome/BlogItemForHome';
import { useEffect, useState } from 'react';
import { getMyPost, getProfile } from '~/redux/apiRequest';
import { useParams } from 'react-router-dom';
import { followUser } from '~/redux/apiRequest';
import Modal from '~/components/Modal/Modal';
const cx = classNames.bind(style);
function Me() {
    const { userId } = useParams(); // Nhận id từ đường dẫn
    console.log('userId', userId);
    const [modal, setModal] = useState(false);
    const handleShowModal = () => {
        setModal(!modal);
    };
    // Sử dụng useLocation để lấy thông tin tài khoản từ location
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    console.log('user', user?._id);
    const handleFollow = () => {
        const id = user._id; // Đặt userId của người dùng hiện tại ở đây
        const followingUserId = userId; // Đặt userId của người dùng mà bạn muốn theo dõi ở đây
        dispatch(followUser(id, followingUserId));
    };

    const [dataProfile, setDataProfile] = useState([]);
    const [posts, setPosts] = useState([]);
    console.log('img', dataProfile.avatar);
    console.log('dataProfile', dataProfile);
    // let axiosJWT = createInstance();
    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                // getMyPost(dispatch, user?.accessToken, user?._id);
                const dataPost = await getMyPost(user?.accessToken, userId);
                setPosts(dataPost?.myPosts);
                const data = await getProfile(userId);
                setDataProfile(data);
            }
        };
        fetchData();
    }, [dispatch, user?.accessToken]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrap-header')}>
                <div className={cx('background-img')}>
                    <img src={imgbg} alt="ảnh bìa" className={cx('bg-image')} />
                </div>
                <div className={cx('wrap-info')}>
                    <div className={cx('wrap-avatar')}>
                        <img src={dataProfile?.avatar} alt="" className={cx('img-avatar')} />
                        <h3 className={cx('display-name')}>{dataProfile?.displayName || dataProfile?.username}</h3>
                    </div>
                    <button className={cx('btn')} onClick={handleFollow}>
                        Theo dõi
                    </button>
                </div>
            </div>
            <div className={cx('grid')}>
                <div className={cx('row')}>
                    <div className={cx('col-3')}>
                        <div className={cx('wrap-info-list')}>
                            <div className={cx('wrap-title')}>
                                <h3 className={cx('title')}>Thông tin cá nhân</h3>
                                {userId === user?._id && (
                                    <button className={cx('btn-icon')} onClick={handleShowModal}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                )}
                            </div>
                            <div className={cx('wrap-list-item')}>
                                <span className={cx('wrap-item')}>
                                    <FontAwesomeIcon icon={faEnvelope} className={cx('icon-item')} />
                                    <span className={cx('title-item')}>{dataProfile?.email}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={cx('col-7')}>
                        {posts && (
                            <div className={cx('wrap-content')}>
                                <h3 className={cx('title-content')}>Bài viết đã đăng</h3>
                                <div className={cx('wrap-blog')}>
                                    {posts.map((post) => (
                                        <BlogItemForHome
                                            title={post.title}
                                            content={post.content}
                                            imageUser={dataProfile.avatar}
                                            nameUser={dataProfile.username}
                                            postId={post._id}
                                            tagName={post.tagName}
                                            to={`/post/${post._id}`}
                                            createAt={post.createdAt}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {modal && (
                <Modal
                    titleBtn={'Lưu'}
                    titleModal={'Chỉnh sửa thông tin cá nhân'}
                    onClose={handleShowModal}
                    className={cx('modal')}
                >
                    <div className={cx('wrap-content-modal')}>
                        <div className={cx('wrap-body-modal')}>
                            <span className={cx('title-content-modal')}>Email</span>
                            <div className={cx('wrap-input')}>
                                <input
                                    type="text"
                                    placeholder="Nhập email của bạn"
                                    className={cx('input-content-modal')}
                                />
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default Me;
