import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import classNames from 'classnames/bind';
import style from './Calendar.module.scss';
import Modal from '../Modal/Modal';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';

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

// ...

// ...

function MyCalendar() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const openModal = (slotInfo) => {
        setSelectedSlot(slotInfo);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedSlot(null);
        setModalOpen(false);
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
                    {/* Render modal content using selectedSlot */}
                    <div className={cx('wrap-modal')}>
                        <div className={cx('modal-header')}>
                            <h2>Thêm sự kiện vào {selectedSlot && selectedSlot.start.toLocaleDateString()}</h2>
                        </div>
                        <div className={cx('modal-content')}>
                            <div className={cx('wrap-input-modal')}>
                                <input
                                    type="text"
                                    placeholder="Nhập tiêu đề cho sự kiện"
                                    className={cx('input-modal')}
                                />
                            </div>
                            <div className={cx('wrap-more')}>
                                <div className={cx('modal-components')}>
                                    <FontAwesomeIcon icon={faClock} className={cx('icon')} />
                                    <h4 className={cx('title')}>Chọn giờ</h4>
                                </div>

                                <div className={cx('wrap-desciptiom')}>
                                    <h4 className={cx('title')}>Mô tả</h4>
                                    <textarea className={cx('desciption')}></textarea>
                                </div>
                            </div>
                        </div>
                        <div className={cx('modal-footer')}>
                            <Button primary className={cx('btn-footer')}>
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// ...

export default MyCalendar;
