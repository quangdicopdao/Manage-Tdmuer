import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-bootstrap-time-picker';
import classNames from 'classnames/bind';
import style from './Calendar.module.scss';
import Modal from '../Modal/Modal';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { createSchedule } from '~/redux/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '~/utils/api';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const cx = classNames.bind(style);
const localizer = momentLocalizer(moment);

function MyCalendar() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedTitle, setSelectedTitle] = useState('');
    const [selectedStartDate, setSelectedStartDate] = useState(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());
    const [selectedStartTime, setSelectedStartTime] = useState(0);
    const [selectedEndTime, setSelectedEndTime] = useState(0);
    const [description, setDescription] = useState('');
    const [schedules, setSchedules] = useState([]);
    const [error, setError] = useState(null);

    const staticCalendarData = [
        {
            id: 1,
            title: 'Meeting 1',
            start: new Date(2024, 0, 19, 10, 0), // 19th January 2024, 10:00 AM
            end: new Date(2024, 0, 19, 12, 0), // 19th January 2024, 12:00 PM
            color: '#FF5733', // Optional: Màu sắc của sự kiện
        },
        {
            id: 2,
            title: 'Meeting 2',
            start: new Date(2024, 0, 20, 14, 0), // 20th January 2024, 2:00 PM
            end: new Date(2024, 0, 20, 16, 0), // 20th January 2024, 4:00 PM
            color: '#337DFF',
        },
        // Thêm các sự kiện khác nếu cần
    ];

    const openModal = (slotInfo) => {
        setSelectedSlot(slotInfo);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedSlot(null);
        setModalOpen(false);
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login.currentUser);
    const id = user._id;
    const accsessToken = user.accsessToken;

    const secondsToHoursAndMinutes = (seconds) => {
        const duration = moment.duration(seconds, 'seconds');
        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    };

    const fetchSchedules = async () => {
        try {
            const response = await axios.get(baseURL + 'schedule/api/show', {
                headers: {
                    Authorization: `Bearer ${accsessToken}`,
                },
            });
            setSchedules(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
            setError(error);
        }
    };

    useEffect(() => {
        if (accsessToken) {
            fetchSchedules();
        }
    }, [accsessToken, schedules]);

    const handleSave = async (e) => {
        e.preventDefault();

        const formattedTimeStart = secondsToHoursAndMinutes(selectedStartTime);
        const formattedTimeEnd = secondsToHoursAndMinutes(selectedEndTime);
        console.log(formattedTimeStart, formattedTimeEnd);
        const dateStart = moment(selectedStartDate).format('YYYY-MM-DD') + ' ' + formattedTimeStart;
        const dateEnd = moment(selectedEndDate).format('YYYY-MM-DD') + ' ' + formattedTimeEnd;
        console.log(dateStart, dateEnd);

        const dateStartUTC = moment.utc(dateStart);
        const dateEndUTC = moment.utc(dateEnd);
        // console.log('Formatted Start Date:', dateStartUTC.toDate());
        // console.log('Formatted End Date:', dateEndUTC.toDate());
        const newSchedule = {
            title: selectedTitle,
            start: new Date(dateStartUTC),
            end: new Date(dateEndUTC),
            description,
            userId: id,
        };

        try {
            await createSchedule(newSchedule, dispatch, navigate, accsessToken);
            fetchSchedules();
            closeModal();
        } catch (error) {
            console.error('Error saving schedule:', error);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <ToastContainer autoClose={3000} />

            <Calendar
                localizer={localizer}
                events={schedules}
                style={{ height: 550 }}
                onSelectEvent={(event) => openModal(event)}
                onSelectSlot={(slotInfo) => openModal(slotInfo)}
                selectable
            />

            {modalOpen && (
                <Modal onClose={closeModal}>
                    <div className={cx('wrap-modal')}>
                        <div className={cx('modal-header')}>
                            <h2>Thêm sự kiện vào {selectedStartDate && moment(selectedStartDate).format('L')}</h2>
                        </div>
                        <div className={cx('modal-content')}>
                            <div className={cx('wrap-input-modal')}>
                                <input
                                    type="text"
                                    placeholder="Nhập tiêu đề cho sự kiện"
                                    className={cx('input-modal')}
                                    value={selectedTitle}
                                    onChange={(e) => setSelectedTitle(e.target.value)}
                                />
                            </div>
                            <div className={cx('wrap-more')}>
                                <div className={cx('wrap-option')}>
                                    <div className={cx('modal-components')}>
                                        <FontAwesomeIcon icon={faCalendarDay} className={cx('icon')} />
                                        <DatePicker
                                            selected={selectedStartDate}
                                            onChange={(date) => setSelectedStartDate(date)}
                                            dateFormat="dd/MM/yyyy"
                                            className={cx('title')}
                                        />
                                    </div>
                                    <div className={cx('modal-components')}>
                                        <FontAwesomeIcon icon={faCalendarDay} className={cx('icon')} />
                                        <DatePicker
                                            selected={selectedEndDate}
                                            onChange={(date) => setSelectedEndDate(date)}
                                            dateFormat="dd/MM/yyyy"
                                            className={cx('title')}
                                        />
                                    </div>
                                </div>
                                <div className={cx('wrap-option')}>
                                    <div className={cx('modal-components')}>
                                        <FontAwesomeIcon icon={faClock} className={cx('icon')} />

                                        <TimePicker
                                            onChange={(time) => setSelectedStartTime(time)}
                                            value={selectedStartTime}
                                            format={24} // Set format to 24 for 24-hour time
                                        />
                                    </div>
                                    <div className={cx('modal-components')}>
                                        <FontAwesomeIcon icon={faClock} className={cx('icon')} />

                                        <TimePicker
                                            onChange={(time) => setSelectedEndTime(time)}
                                            value={selectedEndTime}
                                            format={24} // Set format to 24 for 24-hour time
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
