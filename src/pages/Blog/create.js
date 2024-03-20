import classNames from 'classnames/bind';
import style from './create.module.scss';
import Editor from '~/components/Editor';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, getTags } from '~/redux/apiRequest';
import { useNavigate } from 'react-router-dom';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from '~/components/Modal/Modal';
import moment from 'moment';
import { momentLocalizer } from 'react-big-calendar';

const localizer = momentLocalizer(moment);

const cx = classNames.bind(style);

function CreateBlog() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const user = useSelector((state) => state.auth.login.currentUser);
    const id = user._id;
    const accsessToken = user.accessToken;
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [dataTag, setDataTag] = useState([]);
    console.log('dataTag', dataTag);
    const [tag, setTag] = useState('');
    const [tagId, setTagId] = useState('');
    const [tagBtn, setTagBtn] = useState('Thể loại bài viết');
    console.log('tag', tag);
    const handleSetTag = (id, tag) => {
        setTag(tag);
        setTagId(id);
    };
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    const toggleTag = () => {
        setShow(!show);
    };
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (newContent) => {
        setContent(newContent);
    };
    const handlePickTypeAndDate = () => {
        setTagBtn(tag);
        setShow(!show);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            title,
            content,
            start,
            end,
            tagId,
            id,
        };
        console.log('data: ' + data);
        await createPost(data, dispatch, navigate, accsessToken);
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await getTags();
            setDataTag(data.tags);
        };
        fetchData();
    }, []);
    return (
        <div className={cx('wrapper')}>
            <form onSubmit={handleSubmit}>
                <div className={cx('wrap-input')}>
                    <input type="text" placeholder="Nhập tiêu đề" value={title} onChange={handleTitleChange} />
                    <div className={cx('wrap-actions')}>
                        <Button outline className={cx('btn')} onClick={toggleTag}>
                            {tagBtn}
                        </Button>
                        {show && (
                            <Modal
                                titleBtn={'Xong'}
                                titleModal={'Chọn thể loại và thời gian'}
                                className={cx('modal')}
                                onClose={toggleTag}
                                onSave={handlePickTypeAndDate}
                            >
                                <div className={cx('modal-content')}>
                                    <h4 className={cx('modal-title')}>Danh mục bài viết</h4>
                                    {dataTag && (
                                        <div className={cx('wrap-tag')}>
                                            {dataTag.map((tags) => (
                                                <span
                                                    className={cx('tag-btn', { taggedBtn: tags.name === tag })}
                                                    key={tags._id}
                                                    onClick={() => handleSetTag(tags._id, tags.name)}
                                                >
                                                    {tags.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <h4 className={cx('modal-title')}>Thời gian</h4>
                                    <div className={cx('wrap-time')}>
                                        <div className={cx('time')}>
                                            <DatePicker
                                                calendarClassName={cx('date-picker')}
                                                selected={start}
                                                onChange={(date) => setStart(date)}
                                                className={cx('title')}
                                                showTimeSelect
                                                selectsStart
                                                startDate={start}
                                                timeFormat="HH:mm"
                                                dateFormat="dd/MM/yyyy HH:mm"
                                                timezone="Asia/Ho_Chi_Minh"
                                            />
                                        </div>
                                        <span> - </span>
                                        <div className={cx('time')}>
                                            <DatePicker
                                                calendarClassName={cx('date-picker')}
                                                selected={end}
                                                onChange={(date) => setEnd(date)}
                                                className={cx('title')}
                                                showTimeSelect
                                                selectsStart
                                                startDate={start}
                                                endDate={end}
                                                timeFormat="HH:mm"
                                                dateFormat="dd/MM/yyyy HH:mm"
                                                timezone="Asia/Ho_Chi_Minh"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Modal>
                        )}
                        <Button primary onClick={handleSubmit}>
                            Lưu
                        </Button>
                    </div>
                </div>
                <span className={cx('show-time')}>
                    Thời gian:{' '}
                    {`${moment(start).format('DD/MM/YYYY HH:mm')} - ${moment(end).format('DD/MM/YYYY HH:mm')}`}
                </span>
                <div className={cx('wrap-editor')}>
                    <Editor value={content} onChange={handleContentChange} />
                </div>
            </form>
        </div>
    );
}

export default CreateBlog;
