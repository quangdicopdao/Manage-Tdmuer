import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import style from './table.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { loginSuccess } from '~/redux/authSlice';
import { createInstance } from '~/utils/createInstance';

import { showSchedule } from '~/redux/apiRequest';

const cx = classNames.bind(style);

function MyTable() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    const schedules = useSelector((state) => state.schedule.arrSchedules?.newSchedule);

    let axiosJWT = createInstance(user, dispatch, loginSuccess);

    console.log('schedules', schedules);
    useEffect(() => {
        if (user?.accessToken) {
            showSchedule(dispatch, axiosJWT, user.accessToken);
        }
    }, [user?.accessToken]);
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
                <div className={cx('wrap-input')}>
                    <input type="text" placeholder="Nhập từ khóa tìm kiếm" className={cx('input-search')} />
                    <FontAwesomeIcon icon={faSearch} />
                </div>
                <div className={cx('wrap-btn')}>
                    <Button primary leftIcon={<FontAwesomeIcon icon={faPlus} />}>
                        Thêm hoạt động
                    </Button>
                </div>
            </div>
            <table className={cx('table')}>
                <thead className={cx('table-header')}>
                    <tr>
                        <th>
                            <input type="checkbox" />
                        </th>
                        <th>#</th>
                        <th>Ngày & giờ</th>
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
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>{index + 1}</td>
                                    <td>
                                        {' '}
                                        {`${moment(data.start).format('DD/MM/YYYY HH:mm')} đến ${moment(
                                            data.end,
                                        ).format('DD/MM/YYYY HH:mm')}`}
                                    </td>
                                    <td>{data.title}</td>
                                    <td>{data.description}</td>
                                    <td>
                                        <span className={cx('work-status', secondClassName)}>
                                            {renderStatus(data.statusWork)}
                                        </span>
                                    </td>
                                    <td>
                                        <button className={cx('action-btn')}>
                                            <FontAwesomeIcon icon={faEdit} className={cx('icon-btn', 'icon-edit')} />
                                        </button>
                                        <button className={cx('action-btn')}>
                                            <FontAwesomeIcon icon={faTrash} className={cx('icon-btn', 'icon-delete')} />
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
    );
}

export default MyTable;
