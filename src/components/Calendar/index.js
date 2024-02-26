import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import classNames from 'classnames/bind';
import style from './Calendar.module.scss';
import Modal from '../Modal/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { createSchedule, overviewSchedule } from '~/redux/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '~/utils/api';
import axios from 'axios';
const cx = classNames.bind(style);
const localizer = momentLocalizer(moment);

function MyCalendar({ axiosJWT }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [selectedStartDate, setSelectedStartDate] = useState(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());

    const [description, setDescription] = useState('');
    //set schedule = data
    const [schedules, setSchedules] = useState([]);
    const calendarEvents = useMemo(() => schedules, [schedules]);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login?.currentUser);
    const changstateModal = () => {
        setModalOpen(!modalOpen);
    };

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
            await createSchedule(newSchedule, dispatch, user?.accessToken, changstateModal());
        } catch (error) {
            console.error('Error saving schedule:', error);
        }
    };
    const convertData = useCallback((response) => {
        if (response && response.schedules && Array.isArray(response.schedules)) {
            const events = response.schedules.map((item) => ({
                ...item,
                start: new Date(item.start),
                end: new Date(item.end),
            }));
            setSchedules(events);
        }
    }, []);

    //call api shcedule
    useEffect(() => {
        if (user?.accessToken) {
            const fetchSchedule = async () => {
                try {
                    const res = await axios.get(baseURL + 'schedule/api/overview', {
                        headers: { Authorization: `Bearer ${user?.accessToken}` },
                    });
                    console.log('API Response:', res.data); // Log phản hồi từ API
                    convertData(res.data); // Gọi hàm convertData để chuyển đổi dữ liệu
                } catch (error) {
                    console.log(error);
                }
            };

            fetchSchedule();
            // overviewSchedule(dispatch, axiosJWT, user?.accessToken, convertData);
        }
    }, [user?.accessToken, convertData]);

    return (
        <div className={cx('wrapper')}>
            <Calendar
                localizer={localizer}
                events={schedules}
                style={{ height: 600, width: 1400, marginLeft: 10 }}
                onSelectEvent={(event) => changstateModal(event)}
                onSelectSlot={(slotInfo) => changstateModal(slotInfo)}
                selectable
            />

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

export default MyCalendar;
