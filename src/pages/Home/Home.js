import classNames from 'classnames/bind';
import style from './Home.module.scss';
import MyTable from '~/components/Table';
import { useSelector } from 'react-redux';
import MyCustomCalendar from '~/components/Calendar/MyCustomCalendar';
import CustomTable from '~/components/Table/MyCustomTable/Table';
import { useEffect, useState } from 'react';
import { showMyList } from '~/redux/apiRequest';
import ImageUploader from '~/components/ImageUploader';
import Editor from '~/components/Editor';
const cx = classNames.bind(style);

function Home() {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const [data, setData] = useState([]);
    // const [content, setContent] = useState('');
    // const handleSetContent = (newContent) => {
    //     setContent(newContent);
    // };
    const columns = [
        { key: 'title', label: 'Tên hoạt động' },
        { key: 'createdAt', label: 'Thời gian đăng ký' },
        {
            key: 'isPresent',
            label: 'Điểm danh',
            classNameData1: 'status-not-present',
            classNameData2: 'status-present',
        },
        { key: 'mark', label: 'Điểm rèn luyện' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const rawData = await showMyList(user?._id, user?.accessToken);
            const newData = customizeData(rawData); // Gọi hàm tùy chỉnh dữ liệu
            setData(newData);
        };
        fetchData();
    }, []);
    // Hàm để tùy chỉnh dữ liệu
    const customizeData = (rawData) => {
        // Thực hiện các thay đổi hoặc lọc dữ liệu ở đây
        // Ví dụ:
        if (!rawData) return;
        return rawData.map((item) => ({
            title: item.title,
            createdAt: item.createdAt, // Định dạng lại thời gian
            isPresent: item.isPresent ? 'Đã điểm danh' : 'Chưa điểm danh', // Chuyển đổi giá trị boolean thành 'Có' hoặc 'Không'
            mark: '+ ' + item.mark,
        }));
    };
    return user ? (
        <div className={cx('wrapper')}>
            <div className={cx('wrap-table')}>
                <MyTable />
            </div>
            <div className={cx('wrap-activity')}>
                <span className={cx('title')}>Hoạt động đã tham gia</span>
                <CustomTable data={data} columns={columns} />
            </div>
            {/* <Editor value={content} onChange={handleSetContent} /> */}

            {/* <MyCustomCalendar /> */}
        </div>
    ) : null;
}

export default Home;
