import classNames from 'classnames/bind';
import style from './Post.module.scss';
import Button from '~/components/Button';
import CustomTable from '~/components/Table/MyCustomTable/Table';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showPosts } from '~/redux/apiRequest';
import Pagination from '~/components/Pagination';
const cx = classNames.bind(style);

function AdminPost() {
    const getData = useSelector((state) => state.post.arrPosts?.newPost);
    const posts = getData?.data?.map((post) => {
        // Tạo trường image nếu có đường dẫn ảnh
        const image = post?.content?.match(/<img.*?src="(.*?)".*?>/)?.[1];
        return {
            ...post,
            image: image || '', // Nếu không có ảnh, gán trống
        };
    });
    console.log('posts', posts);
    const dispatch = useDispatch();
    //pagination
    const [currentPage, setCurrentPage] = useState(posts?.page || 1);

    const pageSize = getData?.per_page || 10;
    const totalPages = getData?.total_pages;

    const columns = [
        {
            key: 'image',
            label: 'Ảnh',
            render: (rowData) => (rowData.image ? <img src={rowData.image} alt="Ảnh bài viết" /> : null),
            isImage: true,
            classNameImage: 'img-post',
        },
        { key: 'title', label: 'Tên bài viết' },
        { key: 'content', label: 'Nội dung', isHTML: true, classNameData1: 'content-post' },
        { key: 'createdAt', label: 'Ngày tạo' },
    ];
    useEffect(() => {
        const fetchData = async () => {
            const data = {
                page: currentPage,
                pageSize: pageSize,
            };
            await showPosts(dispatch, data);
        };
        fetchData();
    }, []);
    return (
        <div className={cx('wrapper')}>
            <Button outline to={'/blog/create'} className={cx('btn-create')}>
                Tạo bài viết
            </Button>
            <CustomTable data={posts} columns={columns} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
}

export default AdminPost;
