import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import classNames from 'classnames/bind';
import style from './Calendar.module.scss';
import Modal from '../Modal/Modal';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendarDay } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(style);
const localizer = momentLocalizer(moment);
const myEventsList = [
    {
        start: new Date(2024, 0, 9, 10, 0),
        end: new Date(2024, 0, 9, 12, 0),
        title: 'Meeting with Client',
        color: 'red',
    },
    {
        start: new Date(2024, 0, 10, 14, 30),
        end: new Date(2024, 0, 10, 16, 0),
        title: 'Team Workshop',
        color: 'blue',
    },
];

function MyCalendar() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedTitle, setSelectedTitle] = useState('');
    const [selectedStartDate, setSelectedStartDate] = useState(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());
    const [selectedStartTime, setSelectedStartTime] = useState(new Date());
    const [selectedEndTime, setSelectedEndTime] = useState(new Date());

    const openModal = (slotInfo) => {
        setSelectedSlot(slotInfo);
        setSelectedTitle('');
        setSelectedStartDate(slotInfo.start || new Date());
        setSelectedEndDate(slotInfo.end || new Date());
        setSelectedStartTime(new Date());
        setSelectedEndTime(new Date());
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedSlot(null);
        setModalOpen(false);
    };

    const handleSave = () => {
        // Add your logic to save the event
        console.log({
            title: selectedTitle,
            start: selectedStartDate,
            end: selectedEndDate,
            startTime: selectedStartTime,
            endTime: selectedEndTime,
        });
        closeModal();
    };

    return (
        <div className={cx('wrapper')}>
            <Calendar
                localizer={localizer}
                events={myEventsList}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 550 }}
                eventPropGetter={(event) => ({
                    style: {
                        backgroundColor: event.color,
                    },
                })}
                onSelectEvent={() => openModal()}
                onSelectSlot={(slotInfo) => openModal(slotInfo)}
                selectable={true} // Enable selection of entire days
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
                                            format="HH:mm"
                                            clearIcon={null} // Hide the clear icon
                                            className={cx('title')}
                                        />
                                    </div>
                                    <div className={cx('modal-components')}>
                                        <FontAwesomeIcon icon={faClock} className={cx('icon')} />
                                        <TimePicker
                                            onChange={(time) => setSelectedStartTime(time)}
                                            value={selectedStartTime}
                                            format="HH:mm"
                                            clearIcon={null} // Hide the clear icon
                                            className={cx('title')}
                                        />
                                    </div>
                                </div>
                                <div className={cx('wrap-desciptiom')}>
                                    <h4 className={cx('title')}>Mô tả</h4>
                                    <textarea className={cx('desciption')}></textarea>
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
