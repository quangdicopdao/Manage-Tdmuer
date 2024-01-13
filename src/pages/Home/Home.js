import React, { useState, useEffect } from 'react';
import BlogItemForHome from '~/components/BlogItemForHome/BlogItemForHome';
import classNames from 'classnames/bind';
import style from './Home.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { baseURL } from '~/utils/api';
const cx = classNames.bind(style);

function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(baseURL + 'api/posts');
                console.log('Status Code:', response.status); // Log status code để kiểm tra
                setPosts(response.data.posts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []); // useEffect sẽ chỉ gọi một lần khi component được mount

    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid')}>
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
                                imagePostUrl={post.imageUrl}
                                nameUser={post.userPost}
                                imageUrl={post.imageUser}
                                description={post.description}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
