import classNames from 'classnames/bind';
import style from './Me.moudule.scss';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPen, faVoicemail } from '@fortawesome/free-solid-svg-icons';
import imgbg from '../../assets/background-img.jpeg';
import Button from '~/components/Button';
import BlogItemForHome from '~/components/BlogItemForHome/BlogItemForHome';

const cx = classNames.bind(style);
function Me() {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const posts = useSelector((state) => state.post.arrPosts.newPost.posts);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrap-header')}>
                <div className={cx('background-img')}>
                    <img src={imgbg} alt="ảnh bìa" className={cx('bg-image')} />
                </div>
                <div className={cx('wrap-info')}>
                    <div className={cx('wrap-avatar')}>
                        <img src={user?.avatar} alt="" className={cx('img-avatar')} />
                        <h3 className={cx('display-name')}>{user?.displayName || user?.username}</h3>
                        <Button leftIcon={<FontAwesomeIcon icon={faPen} />} primary className={cx('btn-avatar')}>
                            Chỉnh sửa thông tin
                        </Button>
                    </div>
                    <button className={cx('btn')}>Theo dõi</button>
                </div>
            </div>
            <div className={cx('grid')}>
                <div className={cx('row')}>
                    <div className={cx('col-3')}>
                        <div className={cx('wrap-info-list')}>
                            <h3 className={cx('title')}>Thông tin cá nhân</h3>
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
