import classNames from 'classnames/bind';
import style from './Me.moudule.scss';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPen } from '@fortawesome/free-solid-svg-icons';
import imgbg from '../../assets/background-img.jpeg';
import BlogItemForHome from '~/components/BlogItemForHome/BlogItemForHome';
import { useEffect, useState } from 'react';
import { getMyPost, getProfile } from '~/redux/apiRequest';
import { useParams } from 'react-router-dom';

import { createInstance } from '~/utils/createInstance';

const cx = classNames.bind(style);
function Me() {
    const { userId } = useParams(); // Nhận id từ đường dẫn
    console.log('userId', userId);
    const user = useSelector((state) => state.auth.login?.currentUser);
    const posts = useSelector((state) => state.profile.myProfile.profiles.myPosts);

    const [dataProfile, setDataProfile] = useState([]);
    console.log('setDataProfile', dataProfile);
    const dispatch = useDispatch();
    // let axiosJWT = createInstance();
    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                // getMyPost(dispatch, user?.accessToken, user?._id);
                await getMyPost(dispatch, user?.accessToken, userId);
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
                    <button className={cx('btn')}>Theo dõi</button>
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
                                    <span className={cx('title-item')}>{dataProfile?.email}</span>
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
