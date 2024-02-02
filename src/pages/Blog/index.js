import classNames from 'classnames/bind';
import style from './blog.module.scss';
import React, { useState, useEffect } from 'react';
import BlogItemForHome from '~/components/BlogItemForHome/BlogItemForHome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { baseURL } from '~/utils/api';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { showPosts } from '~/redux/apiRequest';

const cx = classNames.bind(style);
function Blog() {
    const posts = useSelector((state) => state.post.arrPosts?.newPost.posts);
    const user = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();
    useEffect(() => {
        showPosts(dispatch);
    }, [posts]); // useEffect sẽ chỉ gọi một lần khi component được mount
    return (
        <div className={cx('wrapper')}>
            {user && (
                <div className={cx('wrap-action')}>
                    <Button outline leftIcon={<FontAwesomeIcon icon={faPlus} />} to={'/blog/create'}>
                        Tạo mới
                    </Button>
                </div>
            )}
            <div className={cx('wrap-title')}>
                <h2 className={cx('post-title')}>Bài viết nổi bật</h2>
            </div>
            <di v className={cx('grid')}>
                <div className={cx('row')}>
                    {posts.map((post) => (
                        <div key={post._id} className={cx('col-7')}>
                            <BlogItemForHome
                                title={post.title}
                                // imageUser={post.userId.avatar}
                                // nameUser={post.userId.email}
                                content={post.content}
                                to={`/post/${post._id}`}
                                createAt={post.createdAt}
                            />
                        </div>
                    ))}
                </div>
                <div className={cx('row')}>
                    <div className={cx('col-3')}>
                        <div className={cx('wrap-filter')}>
                            <div className={cx('wrap-search')}>
                                <input type="text" placeholder="Tìm kiếm bài viết" className={cx('input-search')} />
                                <FontAwesomeIcon icon={faSearch} className={cx('icon-search')} />
                            </div>
                            <div className={cx('wrap-filter')}>
                                <h3 className={cx('title-filter')}>Nhóm bài viết</h3>
                                <ul className={cx('wrap-list')}>
                                    <li className={cx('list-item')}>
                                        <span className={cx('item-name')}>Quân sự</span>
                                    </li>
                                    <li className={cx('list-item')}>
                                        <span className={cx('item-name')}>Học tập</span>
                                    </li>
                                    <li className={cx('list-item')}>
                                        <span className={cx('item-name')}>Bàn luận làm việc</span>
                                    </li>
                                    <li className={cx('list-item')}>
                                        <span className={cx('item-name')}>Làm việc nhóm</span>
                                    </li>
                                    <li className={cx('list-item')}>
                                        <span className={cx('item-name')}>Bàn luận làm việc</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </di>
        </div>
    );
}

export default Blog;
