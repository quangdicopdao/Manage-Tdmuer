import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import style from './table.module.scss';
import Button from '../Button';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faEdit, faPlus, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '~/redux/authSlice';
import { createInstance } from '~/utils/createInstance';
import { showSchedule } from '~/redux/apiRequest';
import Pagination from '~/components/Pagination';
import Modal from '../Modal/Modal';

const cx = classNames.bind(style);

function MyTable() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    const getData = useSelector((state) => state.schedule.arrSchedules?.newSchedule);
    const schedules = getData.data;
    //dropdown btn
    const [isDropDown, setIsDropDown] = useState(false);
    const [selectedDropDown, setSelectedDropDown] = useState('Sắp tới hạn');
    const [value, setValue] = useState(1);
    //pagination
    const [currentPage, setCurrentPage] = useState(getData?.page);
    const pageSize = getData.per_page;
    const totalPages = getData.total_pages;

    console.log('total pages: ' + totalPages);
    //console.log('schedules.length: ' + schedules.length);
    // status modal
    const [show, setShow] = useState(false);
    //func for show/close modal
    const toggleModal = () => {
        setShow(!show);
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
                statusWork: value,
                page: currentPage, // Thêm thông tin trang hiện tại
                pageSize: pageSize, // Thêm thông tin kích thước trang
            };
            showSchedule(dispatch, axiosJWT, data, user.accessToken);
        }
    }, [user?.accessToken, value, currentPage]);

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
                        <input type="text" placeholder="Nhập từ khóa tìm kiếm" className={cx('input-search')} />
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <div className={cx('wrap-btn-selector')}>
                        <Button outline rightIcon={<FontAwesomeIcon icon={faChevronDown} />} onClick={toggleDropDown}>
                            {selectedDropDown}
                        </Button>
                        {isDropDown && (
                            <ul className={cx('dropdown-menu')}>
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
                </div>
                <div className={cx('wrap-btn')}>
                    <Button primary leftIcon={<FontAwesomeIcon icon={faPlus} />}>
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
                            <th>#</th>
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
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                        <td>{index + 1}</td>
                                        <td>
                                            {' '}
                                            {` ${moment(data.end).format('HH:mm')} - ${moment(data.end).format(
                                                'DD/MM/YYYY',
                                            )}`}
                                        </td>
                                        <td>{data.title}</td>
                                        <td>{data.description}</td>
                                        <td>
                                            <span className={cx('work-status', secondClassName)}>
                                                {renderStatus(data.statusWork)}
                                            </span>
                                        </td>
                                        <td>
                                            <button className={cx('action-btn')} onClick={() => toggleModal()}>
                                                <FontAwesomeIcon
                                                    icon={faEdit}
                                                    className={cx('icon-btn', 'icon-edit')}
                                                />
                                            </button>
                                            <button className={cx('action-btn')}>
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    className={cx('icon-btn', 'icon-delete')}
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
        </div>
    );
}

export default MyTable;
