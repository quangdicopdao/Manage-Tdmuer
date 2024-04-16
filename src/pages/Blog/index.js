import classNames from 'classnames/bind';
import style from './blog.module.scss';
import React, { useEffect, useState } from 'react';
import BlogItemForHome from '~/components/BlogItemForHome/BlogItemForHome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { getTags, savedPosts, searchPost, showPosts } from '~/redux/apiRequest';
import Pagination from '~/components/Pagination';

const cx = classNames.bind(style);

function Blog() {
    const getData = useSelector((state) => state.post.arrPosts?.newPost);
    const posts = getData?.data;
    const user = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();
    //pagination
    const [currentPage, setCurrentPage] = useState(posts?.page || 1);

    const pageSize = getData?.per_page || 10;
    const totalPages = getData?.total_pages;
    // Search
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [selectedTagId, setSelectedTagId] = useState('');

    //save post

    const handleSavePost = async (postId) => {
        const data = {
            postId,
            userId: user?._id,
        };
        try {
            const res = await savedPosts(data);
            if (res) {
                console.log('Data from response:', res.data); // Log dữ liệu phản hồi để xem nó bao gồm gì
                console.log('Message:', res.data.message); // Truy cập vào thông điệp từ dữ liệu phản hồi
                console.log('Bài viết đã được lưu thành công', res);
            }
        } catch (error) {
            console.error('Lỗi khi lưu bài viết:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = async () => {
        try {
            const res = await searchPost(searchQuery, selectedTagId);
            setSearchResult(res);
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    const handleTagFilter = (id) => {
        setSelectedTagId(id);
        handleSearchSubmit();
    };
    const [tag, setTag] = useState([]);
    console.log('tag:', tag);

    useEffect(() => {
        const fetchData = async () => {
            const data = {
                page: currentPage,
                pageSize: pageSize,
            };
            showPosts(dispatch, data);
            const tagdata = await getTags();
            setTag(tagdata.tags);
            handleSearchSubmit();
        };
        fetchData();
    }, [dispatch, user?.accessToken, searchQuery, currentPage, selectedTagId]);

    // Chọn danh sách bài viết để hiển thị dựa trên có query tìm kiếm hay không
    const displayPosts = searchQuery || selectedTagId ? searchResult : posts;
    console.log(posts);

    return (
        <div className={cx('wrapper')}>
            {user && (
                <div className={cx('wrap-action')}>
                    <Button
                        outline
                        leftIcon={<FontAwesomeIcon icon={faPlus} />}
                        to={'/blog/create'}
                        className={cx('btn-create')}
                    >
                        Tạo mới
                    </Button>
                </div>
            )}
            <div className={cx('wrap-title')}>
                <h2 className={cx('post-title')}>Bài viết nổi bật</h2>
            </div>
            <div className={cx('grid')}>
                <div className={cx('row')}>
                    {!displayPosts ? (
                        <div className={cx('col-7')}>Không tìm thấy bài viết tương ứng</div>
                    ) : (
                        displayPosts.map((post) => (
                            <div key={post._id} className={cx('col-7')}>
                                <BlogItemForHome
                                    title={post.title}
                                    content={post.content}
                                    imageUser={post.userId.avatar}
                                    nameUser={post.userId.username}
                                    postId={post._id}
                                    to={`/post/${post._id}`}
                                    tagName={post.tagName}
                                    createAt={post.createdAt}
                                    savePost={() => {
                                        handleSavePost(post._id);
                                    }}
                                />
                            </div>
                        ))
                    )}
                    {displayPosts && (
                        <div className={cx('wrap-page-number')}>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>

                <div className={cx('row')}>
                    <div className={cx('col-3')}>
                        <div className={cx('wrap-filter')}>
                            <div className={cx('wrap-search')}>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm bài viết"
                                    className={cx('input-search')}
                                    onChange={handleSearchChange}
                                />
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className={cx('icon-search')}
                                    onClick={handleSearchSubmit}
                                />
                            </div>
                            <div className={cx('wrap-filter')}>
                                <h3 className={cx('title-filter')}>Nhóm bài viết</h3>
                                {tag && tag.length > 0 && (
                                    <ul className={cx('wrap-list')}>
                                        {tag.map((data) => (
                                            <li
                                                className={cx('list-item')}
                                                key={data._id}
                                                onClick={() => {
                                                    handleTagFilter(data._id);
                                                }}
                                            >
                                                <span className={cx('item-name')}>{data.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Blog;
