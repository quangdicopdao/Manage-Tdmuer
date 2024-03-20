import React, { useEffect, useState, useMemo } from 'react';
import classNames from 'classnames/bind';
import style from './table.module.scss';
import Button from '../Button';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faEdit, faPlus, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '~/redux/authSlice';
import { createInstance } from '~/utils/createInstance';
import { deleteSchedule, editSchedule, showSchedule, updateStatus } from '~/redux/apiRequest';
import Pagination from '~/components/Pagination';
import Modal from '../Modal/Modal';

import { momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { createSchedule } from '~/redux/apiRequest';
import { useNavigate } from 'react-router-dom';
const localizer = momentLocalizer(moment);
const cx = classNames.bind(style);

function MyTable() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    const getData = useSelector((state) => state.schedule.arrSchedules?.newSchedule);
    const schedules = getData.data;
    const [checkedItems, setCheckedItems] = useState({});
    const [updateCount, setUpdateCount] = useState(0);

    // Function để cập nhật trạng thái checked của checkbox
    const [completedJobIndexes, setCompletedJobIndexes] = useState([]);

    useEffect(() => {
        const completedIndexes = schedules.reduce((acc, current, index) => {
            if (current.statusWork === 2) {
                acc.push(index);
            }
            return acc;
        }, []);
        setCompletedJobIndexes(completedIndexes);
    }, [schedules]);

    const shouldCheckboxBeChecked = (index) => {
        return completedJobIndexes.includes(index);
    };

    const handleUpdateStatus = async (scheduleId, index) => {
        try {
            await updateStatus(scheduleId, user?.accessToken);
            setCompletedJobIndexes((prevIndexes) =>
                prevIndexes.includes(index) ? prevIndexes.filter((id) => id !== index) : [...prevIndexes, index],
            );
            setUpdateCount(updateCount + 1);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    // Render checkbox và xử lý sự kiện khi click vào checkbox
    const renderCheckbox = (index, scheduleId) => {
        const isChecked = shouldCheckboxBeChecked(index);
        return <input type="checkbox" checked={isChecked} onChange={() => handleUpdateStatus(scheduleId, index)} />;
    };
    //dropdown btn
    const [isDropDown, setIsDropDown] = useState(false);
    const [selectedDropDown, setSelectedDropDown] = useState('Tất cả');
    const [value, setValue] = useState(5);
    //pagination
    const [currentPage, setCurrentPage] = useState(getData?.page);
    const pageSize = getData.per_page;
    const totalPages = getData.total_pages;

    console.log('total pages: ' + totalPages);
    //console.log('schedules.length: ' + schedules.length);
    const [searchQuery, setSearchQuery] = useState('');
    const handleChangQuery = (e) => {
        setSearchQuery(e.target.value);
    };
    // add shedule
    const [modalOpen, setModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [selectedStartDate, setSelectedStartDate] = useState(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());
    const [description, setDescription] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    //set schedule = data

    const navigate = useNavigate();
    const changstateModal = () => {
        setModalOpen(!modalOpen);
    };
    const [updateCounter, setUpdateCounter] = useState(0);
    //delete schedule
    const handleDeleteSchedule = async (scheduleId) => {
        try {
            await deleteSchedule(scheduleId, user?.accessToken);
            // Tăng giá trị của biến đếm hoặc cập nhật biến cờ sau mỗi lần xóa lịch trình
            setUpdateCounter(updateCounter + 1);
        } catch (error) {
            console.error('Error deleting schedule:', error);
        }
    };

    const [idSchedule, setIdSchedule] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    // save to db
    const handleSave = async (e) => {
        e.preventDefault();

        const formattedStartDate = moment(selectedStartDate).utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        const formattedEndDate = moment(selectedEndDate).utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ');

        const newSchedule = {
            title,
            start: formattedStartDate,
            end: formattedEndDate,
            description,
            userId: user?._id,
        };

        try {
            if (isEdit) {
                await editSchedule(idSchedule, newSchedule, user?.accessToken, changstateModal());
                setUpdateCounter(updateCounter + 1);
            } else {
                await createSchedule(newSchedule, dispatch, user?.accessToken, changstateModal());
                setUpdateCounter(updateCounter + 1);
            }
        } catch (error) {
            console.error('Error saving schedule:', error);
        }
    };
    const handleNewSchedule = () => {
        changstateModal();
        setTitle('');
        setSelectedStartDate(new Date());
        setSelectedEndDate(new Date());
        setDescription('');
        setIdSchedule('');
        setIsEdit(false);
    };
    const handleLoadDataToModal = (id, title, start, end, description) => {
        changstateModal();
        setTitle(title);
        setSelectedStartDate(new Date(start));
        setSelectedEndDate(new Date(end));
        setDescription(description);
        setIdSchedule(id);
        setIsEdit(!!id);
    };

    const setTiltle = (value, title) => {
        setSelectedDropDown(title);
        setValue(value);
        setIsDropDown(false);
    };
    const toggleDropDown = () => {
        setIsDropDown(!isDropDown);
    };
    let axiosJWT = createInstance(user, dispatch, loginSuccess);

    useEffect(() => {
        if (user?.accessToken) {
            const data = {
                query: searchQuery,
                selectedDate,
                statusWork: value,
                page: currentPage, // Thêm thông tin trang hiện tại
                pageSize: pageSize, // Thêm thông tin kích thước trang
            };
            showSchedule(dispatch, axiosJWT, data, user.accessToken);
        }
    }, [user?.accessToken, value, currentPage, updateCounter, searchQuery, selectedDate, updateCount]);

    //render status
    const renderStatus = (data) => {
        switch (data) {
            case 0: {
                return 'Chưa hoàn thành';
            }
            case 1: {
                return 'Sắp tới hạn';
            }
            case 2: {
                return 'Hoàn thành';
            }
            case 3: {
                return 'Quá hạn';
            }
            default: {
                return 'Unknown Status';
            }
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h3>Hoạt động của tôi</h3>
            <div className={cx('wrap-actions')}>
                <div className={cx('wrap-input-selector')}>
                    <div className={cx('wrap-input')}>
                        <input
                            type="text"
                            placeholder="Nhập từ khóa tìm kiếm"
                            className={cx('input-search')}
                            value={searchQuery}
                            onChange={handleChangQuery}
                        />
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <div className={cx('wrap-btn-selector')}>
                        <Button
                            outline
                            rightIcon={<FontAwesomeIcon icon={isDropDown ? faChevronUp : faChevronDown} />}
                            onClick={toggleDropDown}
                        >
                            {selectedDropDown}
                        </Button>
                        {isDropDown && (
                            <ul className={cx('dropdown-menu')}>
                                <li className={cx('dropdown-item')} onClick={() => setTiltle(5, 'Tất cả')}>
                                    Tất cả
                                </li>
                                <li className={cx('dropdown-item')} onClick={() => setTiltle(0, 'Chưa hoàn thành')}>
                                    Chưa hoàn thành
                                </li>
                                <li className={cx('dropdown-item')} onClick={() => setTiltle(1, 'Sắp tới hạn')}>
                                    Sắp tới hạn
                                </li>
                                <li className={cx('dropdown-item')} onClick={() => setTiltle(2, 'Hoàn thành')}>
                                    Hoàn thành
                                </li>
                                <li className={cx('dropdown-item')} onClick={() => setTiltle(3, 'Quá hạn')}>
                                    Quá hạn
                                </li>
                            </ul>
                        )}
                    </div>
                    <div className={cx('wrap-datepicker')}>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className={cx('datepicker')}
                        />
                    </div>
                </div>
                <div className={cx('wrap-btn')}>
                    <Button primary leftIcon={<FontAwesomeIcon icon={faPlus} />} onClick={handleNewSchedule}>
                        Thêm hoạt động
                    </Button>
                </div>
            </div>
            <div className={cx('wrap-table')}>
                <table className={cx('table')}>
                    <thead className={cx('table-header')}>
                        <tr>
                            <th>
                                <input type="checkbox" />
                            </th>
                            <th>STT</th>
                            <th>Thời gian kết thúc</th>
                            <th>Tên công việc</th>
                            <th>Mô tả công việc</th>
                            <th>Trạng thái</th>
                            <th>Chức năng</th>
                        </tr>
                    </thead>
                    <tbody className={cx('table-body')}>
                        {schedules && schedules.length > 0 ? (
                            schedules.map((data, index) => {
                                // Di chuyển logic của renderStatus vào đây
                                let secondClassName;
                                switch (data.statusWork) {
                                    case 0: {
                                        secondClassName = 'work-status-pending';
                                        break;
                                    }
                                    case 1: {
                                        secondClassName = 'work-status-upcoming';
                                        break;
                                    }
                                    case 2: {
                                        secondClassName = 'work-status-done';
                                        break;
                                    }
                                    case 3: {
                                        secondClassName = 'work-status-overdue';
                                        break;
                                    }
                                    default: {
                                        secondClassName = '';
                                    }
                                }

                                return (
                                    <tr key={index}>
                                        <td>{renderCheckbox(index, data._id)}</td>
                                        <td>{index + 1}</td>
                                        <td>
                                            {' '}
                                            {` ${moment(data.end).format('HH:mm')} - ${moment(data.end).format(
                                                'DD/MM/YYYY',
                                            )}`}
                                        </td>
                                        <td className={cx('title-content')}>{data.title}</td>
                                        <td className={cx('description-content')}>{data.description}</td>
                                        <td>
                                            <span className={cx('work-status', secondClassName)}>
                                                {renderStatus(data.statusWork)}
                                            </span>
                                        </td>
                                        <td className={cx('btn-content')}>
                                            <button className={cx('action-btn')}>
                                                <FontAwesomeIcon
                                                    icon={faEdit}
                                                    className={cx('icon-btn', 'icon-edit')}
                                                    onClick={() =>
                                                        handleLoadDataToModal(
                                                            data._id,
                                                            data.title,
                                                            data.start,
                                                            data.end,
                                                            data.description,
                                                        )
                                                    }
                                                />
                                            </button>
                                            <button className={cx('action-btn')}>
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    className={cx('icon-btn', 'icon-delete')}
                                                    onClick={() => {
                                                        handleDeleteSchedule(data._id);
                                                    }}
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={7}>Không có dữ liệu hoạt động.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            {/* <Modal titleModal={'Sửa lịch trình'} titleBtn={'Lưu'} onClose={toggleModal}></Modal> */}
            {modalOpen && (
                <Modal onClose={changstateModal} titleModal={'Thêm sự kiện'} titleBtn={'Lưu'} onSave={handleSave}>
                    <div className={cx('wrap-modal')}>
                        <div className={cx('modal-content')}>
                            <div className={cx('wrap-input-modal')}>
                                <input
                                    type="text"
                                    placeholder="Nhập tiêu đề cho sự kiện"
                                    className={cx('input-modal')}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className={cx('wrap-more')}>
                                <div className={cx('wrap-option')}>
                                    <div className={cx('modal-components')}>
                                        <FontAwesomeIcon icon={faCalendarDay} className={cx('icon')} />
                                        <DatePicker
                                            calendarClassName={cx('date-picker')}
                                            selected={selectedStartDate}
                                            onChange={(date) => setSelectedStartDate(date)}
                                            className={cx('title')}
                                            showTimeSelect
                                            selectsStart
                                            startDate={selectedStartDate}
                                            endDate={selectedEndDate}
                                            timeFormat="HH:mm"
                                            dateFormat="dd/MM/yyyy HH:mm"
                                            timezone="Asia/Ho_Chi_Minh"
                                        />
                                        <span>-</span>
                                        <DatePicker
                                            calendarClassName={cx('date-picker')}
                                            selected={selectedEndDate}
                                            onChange={(date) => setSelectedEndDate(date)}
                                            className={cx('title')}
                                            showTimeSelect
                                            selectsEnd
                                            startDate={selectedStartDate}
                                            endDate={selectedEndDate}
                                            minDate={selectedStartDate}
                                            timeFormat="HH:mm"
                                            dateFormat="dd/MM/yyyy HH:mm"
                                            timezone="Asia/Ho_Chi_Minh"
                                        />
                                    </div>
                                </div>
                                <div className={cx('wrap-desciptiom')}>
                                    <h4 className={cx('title')}>Mô tả</h4>
                                    <textarea
                                        className={cx('desciption')}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default MyTable;
