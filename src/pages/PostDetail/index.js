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
                        <img
                            className={cx('img-user')}
                            src="https://scontent.fsgn21-1.fna.fbcdn.net/v/t39.30808-1/378393423_1307195950164637_4310189808608344293_n.jpg?stp=dst-jpg_p320x320&_nc_cat=111&ccb=1-7&_nc_sid=5740b7&_nc_ohc=U09W18M-OjwAX_slAx0&_nc_ht=scontent.fsgn21-1.fna&oh=00_AfC1jP6GW7_QiyA41u2IbYRN_ieOoic9f09hdxTx8OGY9w&oe=659EC722"
                        />
                        <div className={cx('wrap-info')}>
                            <h3 className={cx('name-user')}>Đặng Việt Quang</h3>
                            <h4 className={cx('date-post')}>2 năm trước</h4>
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
