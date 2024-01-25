import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import style from './PostDetail.module.scss';
import Button from '../../components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import { baseURL } from '~/utils/api';
import { useParams } from 'react-router-dom';
const cx = classNames.bind(style);
function PostDetail() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const renderHTML = (htmlString) => {
        return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
    };
    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const response = await axios.get(baseURL + `api/posts/${postId}`);
                setPost(response.data.post);
            } catch (error) {
                console.error('Error fetching post detail:', error);
            }
        };

        fetchPostDetail();
    }, [postId]);

    if (!post) {
        return <div>Loading...</div>;
    }
    return (
        <div className={cx('wrapper')}>
            <div className={cx('row')}>
                <div className={cx('col-7')}>
                    <div className={cx('wrap-content')}>
                        <h2 className={cx('title-content')}>{post.title} </h2>
                        <p className={cx('content')}>{renderHTML(post.content)}</p>
                    </div>
                </div>
                <div className={cx('col-3')}>
                    <div className={cx('wrap-user')}>
                        <img className={cx('img-user')} src={post.userId.avatar} />
                        <div className={cx('wrap-info')}>
                            <h3 className={cx('name-user')}>{post.userId.email}</h3>
                            <h4 className={cx('date-post')}>{post.createdAt}</h4>
                        </div>
                    </div>
                    <div className={cx('wrap-action')}>
                        <Button
                            leftIcon={<FontAwesomeIcon icon={faHeart} className={cx('btn-icon')} />}
                            classNames={cx('btn-action')}
                        >
                            <span className={cx('count')}>500</span>
                        </Button>
                        <Button
                            leftIcon={
                                <FontAwesomeIcon
                                    icon={faComment}
                                    className={cx('btn-icon')}
                                    classNames={cx('btn-action')}
                                />
                            }
                        >
                            <span className={cx('count')}>500</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostDetail;
