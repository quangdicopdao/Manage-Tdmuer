import classNames from 'classnames/bind';
import style from './manage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';
import { faBlog } from '@fortawesome/free-solid-svg-icons';
import CustomTable from '~/components/Table/MyCustomTable/Table';
import { useSelector, useDispatch } from 'react-redux';
import { getMyPost } from '~/redux/apiRequest';

const cx = classNames.bind(style);

function ManagePost() {
    //declare variables
    const [onTab, setOnTab] = useState('posted');
    const user = useSelector((state) => state.auth.login?.currentUser);
    const [arrPost, setArrPost] = useState([]);
    console.log('arrPost', typeof arrPost);
    const handleTab = (id) => {
        setOnTab(id);
    };
    useEffect(() => {
        const fetchData = async () => {
            const dataPost = await getMyPost(user?.accessToken, user?._id);
            setArrPost(dataPost?.myPosts);
        };
        fetchData();
    }, []); // Chuyển một mảng rỗng vào useEffect để chỉ gọi hàm một lần khi component được mount

    const columns = [
        { key: 'title', label: 'Tiêu đề bài viết', className: 'custom-title' },
        { key: 'createdAt', label: 'Thời gian đăng', className: 'custom-createAt' },
        { key: 'actions', label: 'Chức năng', isAction: true, className: 'custom-actions' }, // Thêm cột chứa các chức năng
    ];

    // Hàm xử lý sự kiện xóa bài viết
    const handleDelete = (row) => {
        // Viết mã xử lý xóa bài viết ở đây
        console.log('Delete post:', row);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrap-tab')}>
                <div className={cx('action-tab', { isOnTab: onTab === 'posted' })} onClick={() => handleTab('posted')}>
                    <FontAwesomeIcon icon={faBlog} className={cx('icon-btn')} />
                    <button className={cx('btn-action-tab')}>Bài viết đã đăng</button>
                </div>
                <div className={cx('action-tab', { isOnTab: onTab === 'saved' })} onClick={() => handleTab('saved')}>
                    <FontAwesomeIcon icon={faBookmark} className={cx('icon-btn')} />
                    <button className={cx('btn-action-tab')}>Bài viết đã lưu</button>
                </div>
            </div>
            <div className={cx('wrap-table')}>
                {/* Truyền hàm xóa vào CustomTable */}
                <CustomTable
                    data={arrPost}
                    columns={columns}
                    onDelete={handleDelete}
                    onViewLink={(row) => `/post/${row._id}`}
                    onEditLink={handleDelete}
                />
            </div>
        </div>
    );
}

export default ManagePost;
