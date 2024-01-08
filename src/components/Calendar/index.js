import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import classNames from 'classnames/bind';
import style from './Calendar.module.scss';
import Modal from '../Modal/Modal';

const cx = classNames.bind(style);
const localizer = momentLocalizer(moment);

const MyCalendar = () => {
    const [events, setEvents] = useState([]);

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleSelectSlot = (slotInfo) => {
        setSelectedSlot(slotInfo);
        setShowModal(true);
    };

    const handleHideModal = () => {
        setShowModal(false);
    };

    const handleAddEvent = (newEvent) => {
        setEvents([...events, newEvent]);
        setShowModal(false);
    };

    return (
        <div className={cx('wrapper')}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                selectable
                onSelectSlot={handleSelectSlot}
            />
            {showModal && <Modal selectedSlot={selectedSlot} onClose={handleHideModal} onAddEvent={handleAddEvent} />}
        </div>
    );
};

export default MyCalendar;
