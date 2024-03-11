import React, { useState } from 'react';
import classNames from 'classnames/bind';
import style from './MyCustomCalendar.module.scss';
import { format, addDays, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';

const cx = classNames.bind(style);

const daysOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
const hoursOfDay = [...Array(24).keys()];

const MyCustomCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInWeek = () => {
        const days = [];
        const startDay = new Date(currentDate);
        const diff = startDay.getDay() === 0 ? 6 : startDay.getDay() - 1; // Start from Monday
        startDay.setDate(startDay.getDate() - diff);
        for (let i = 0; i < 7; i++) {
            const day = addDays(startDay, i);
            days.push(day);
        }
        return days;
    };

    const renderCalendar = () => {
        const days = getDaysInWeek();

        return (
            <div className={cx('calendar')}>
                <div className={cx('header')}>
                    <button onClick={() => setCurrentDate(subDays(currentDate, 7))}>Previous</button>
                    <h1>{format(currentDate, 'MMMM yyyy', { locale: vi })}</h1>
                    <button onClick={() => setCurrentDate(addDays(currentDate, 7))}>Next</button>
                </div>
                <div className={cx('days-of-week')}>
                    <div className={cx('day')}></div>
                    {days.map((day, index) => (
                        <div key={index} className={cx('day')}>
                            <div className={cx('day-info')}>
                                <div className={cx('day-name')}>{format(day, 'EEEE', { locale: vi })}</div>
                                <div className={cx('day-number')}>{format(day, 'd')}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={cx('days')}>
                    <div className={cx('timeline')}>
                        {hoursOfDay.map((hour) => (
                            <div key={hour} className={cx('hour')}>
                                <div className={cx('hour-separator')}></div> {/* Thêm đường kẻ */}
                                {hour}:00
                            </div>
                        ))}
                    </div>
                    {days.map((day, index) => (
                        <div key={index} className={cx('day')}>
                            abc
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return renderCalendar();
};

export default MyCustomCalendar;
