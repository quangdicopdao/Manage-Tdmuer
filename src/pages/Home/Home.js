import React, { useState, useEffect } from 'react';
import BlogItemForHome from '~/components/BlogItemForHome/BlogItemForHome';
import classNames from 'classnames/bind';
import style from './Home.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { baseURL } from '~/utils/api';
import Button from '../../components/Button';
import MyTable from '~/components/Table';
import { useSelector } from 'react-redux';
const cx = classNames.bind(style);

function Home() {
    const [posts, setPosts] = useState([]);

    const user = useSelector((state) => state.auth.login.currentUser);
    let accsessToken = null;

    if (user) {
        accsessToken = user.accsessToken;
    }
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(baseURL + 'api/posts');
                console.log('Status Code:', response.status); // Log status code để kiểm tra
                console.log('Data from API:', response.data.posts); // Log data để kiểm tra
                setPosts(response.data.posts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []); // useEffect sẽ chỉ gọi một lần khi component được mount

    return (
        <div className={cx('wrapper')}>
            {/* <div className={cx('grid')}>
                {user && (
                    <div className={cx('wrap-action')}>
                        <Button outline leftIcon={<FontAwesomeIcon icon={faPlus} />} to={'/blog/create'}>
                            Tạo mới
                        </Button>
                    </div>
                )}
                <div className={cx('wrap-title')}>
                    <h2 className={cx('post-title')}>Bài viết nổi bật</h2>
                    <div className={cx('wrap-view-all')}>
                        <a href="/" className={cx('text-link')}>
                            Xem tất cả
                        </a>
                        <FontAwesomeIcon className={cx('text-link')} icon={faCircleChevronRight} />
                    </div>
                </div>
                <div className={cx('row')}>
                    {posts.map((post) => (
                        <div key={post._id} className={cx('col')}>
                            <BlogItemForHome
                                title={post.title}
                                imageUser={post.userId.avatar}
                                nameUser={post.userId.email}
                                content={post.content}
                                to={`/post/${post._id}`}
                            />
                        </div>
                    ))}
                </div>
            </div> */}
            <div className={cx('wrap-table')}>
                <MyTable accsessToken={accsessToken} />
            </div>
        </div>
    );
}

export default Home;
