import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import classNames from 'classnames/bind';
import style from './Calendar.module.scss';
import Modal from '../Modal/Modal';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { createSchedule, showSchedule } from '~/redux/apiRequest';
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
    const [schedules, setSchedules] = useState([]);
    const calendarEvents = useMemo(() => schedules, [schedules]);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login?.currentUser);
    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
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
            await createSchedule(newSchedule, dispatch, navigate, user?.accessToken);
            closeModal();
        } catch (error) {
            console.error('Error saving schedule:', error);
        }
    };

    //call api shcedule
    useEffect(() => {
        if (user?.accessToken) {
            showSchedule(dispatch, axiosJWT, user?.accessToken);
        }
    }, [user?.accessToken, schedules]);

    const convertData = useCallback(
        (schedules) => {
            if (schedules.length > 0) {
                const events = schedules.map((item) => ({
                    ...item,
                    start: new Date(item.start),
                    end: new Date(item.end),
                }));
                setSchedules(events);
            }
        },

        [schedules],
    );

    return (
        <div className={cx('wrapper')}>
            <Calendar
                localizer={localizer}
                events={calendarEvents}
                style={{ height: 600, width: 1400, marginLeft: 10 }}
                onSelectEvent={(event) => openModal(event)}
                onSelectSlot={(slotInfo) => openModal(slotInfo)}
                selectable
            />

            {modalOpen && (
                <Modal onClose={closeModal}>
                    <div className={cx('wrap-modal')}>
                        <div className={cx('modal-header')}>
                            <h2>Thêm sự kiện </h2>
                        </div>
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
                        <div className={cx('modal-footer')}>
                            <Button primary className={cx('btn-footer')} onClick={handleSave}>
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default MyCalendar;
