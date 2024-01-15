import React, { useState, useEffect } from 'react';
import BlogItemForHome from '~/components/BlogItemForHome/BlogItemForHome';
import classNames from 'classnames/bind';
import style from './Home.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { baseURL } from '~/utils/api';
import Button from '../../components/Button';
const cx = classNames.bind(style);

function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // const fetchPosts = async () => {
        //     try {
        //         const response = await axios.get(baseURL + 'api/posts');
        //         console.log('Status Code:', response.status); // Log status code để kiểm tra
        //         setPosts(response.data.posts);
        //     } catch (error) {
        //         console.error('Error fetching posts:', error);
        //     }
        // };

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
    }, [posts]); // useEffect sẽ chỉ gọi một lần khi component được mount

    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid')}>
                <div className={cx('wrap-action')}>
                    <Button outline leftIcon={<FontAwesomeIcon icon={faPlus} />} to={'/blog/create'}>
                        Tạo mới
                    </Button>
                </div>
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
                                imagePostUrl={post.userId.avatar}
                                nameUser={post.userId.username}
                                imageUrl={post.userId.avatar}
                                to={`/post/${post._id}`}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
