import classNames from 'classnames/bind';
import style from './Me.moudule.scss';

import { useSelector, useDispatch } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPen } from '@fortawesome/free-solid-svg-icons';
import imgbg from '../../assets/background-img.jpeg';
import BlogItemForHome from '~/components/BlogItemForHome/BlogItemForHome';
import { useLocation } from 'react-router-dom';
import { followUser } from '~/redux/apiRequest';
import { useNavigate } from 'react-router-dom';
import { useEffect, Button } from 'react';
import { getMyPost } from '~/redux/apiRequest';
import { createInstance } from '~/utils/createInstance';

const cx = classNames.bind(style);
function Me() {
    // Sử dụng useLocation để lấy thông tin tài khoản từ location
    const dispatch = useDispatch();
    //const navigate = useNavigate();
    const location = useLocation();
    const userData = location.state?.userData;
    const user = useSelector((state) => state.auth.login?.currentUser);
    //const posts = useSelector((state) => state.post.arrPosts.newPost.posts);
    
    // Nếu có dữ liệu từ `AccountItem`, sử dụng nó, nếu không thì sử dụng thông tin đăng nhập
    const displayUser = userData ;
    const handleFollow = () => {
        const userId = user._id; // Đặt userId của người dùng hiện tại ở đây
        const followingUserId = displayUser._id; // Đặt userId của người dùng mà bạn muốn theo dõi ở đây
        dispatch(followUser(userId, followingUserId));
    };
    const posts = useSelector((state) => state.profile.myProfile.profiles.myPosts);
    
    let axiosJWT = createInstance();
    useEffect(() => {
        if (user) {
            getMyPost(dispatch, axiosJWT, user?.accessToken, user?._id);
        }
    }, [dispatch, user?.accessToken]);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrap-header')}>
                <div className={cx('background-img')}>
                    <img src={imgbg} alt="ảnh bìa" className={cx('bg-image')} />
                </div>
                <div className={cx('wrap-info')}>
                    <div className={cx('wrap-avatar')}>
                        <img src={displayUser?.avatar} alt="" className={cx('img-avatar')} />
                        <h3 className={cx('display-name')}>{displayUser?.displayName || displayUser?.username}</h3>
                        <Button leftIcon={<FontAwesomeIcon icon={faPen} />} primary className={cx('btn-avatar')}>
                            Chỉnh sửa thông tin
                        </Button>
                        <img src={user?.avatar} alt="" className={cx('img-avatar')} />
                        <h3 className={cx('display-name')}>{user?.displayName || user?.username}</h3>
                    </div>
                    <button className={cx('btn')} onClick={handleFollow}>Theo dõi</button>
                </div>
            </div>
            <div className={cx('grid')}>
                <div className={cx('row')}>
                    <div className={cx('col-3')}>
                        <div className={cx('wrap-info-list')}>
                            <div className={cx('wrap-title')}>
                                <h3 className={cx('title')}>Thông tin cá nhân</h3>
                                <button className={cx('btn-icon')}>
                                    <FontAwesomeIcon icon={faPen} />
                                </button>
                            </div>
                            <div className={cx('wrap-list-item')}>
                                <span className={cx('wrap-item')}>
                                    <FontAwesomeIcon icon={faEnvelope} className={cx('icon-item')} />
                                    <span className={cx('title-item')}>{user?.email}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={cx('col-7')}>
                        {posts && (
                            <div className={cx('wrap-content')}>
                                <h3 className={cx('title-content')}>Bài viết đã đăng</h3>
                                {posts.map((post) => (
                                    <BlogItemForHome
                                        title={post.title}
                                        // imageUser={post.userId.avatar}
                                        // nameUser={post.userId.email}
                                        content={post.content}
                                        to={`/post/${post._id}`}
                                        createAt={post.createdAt}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Me;
