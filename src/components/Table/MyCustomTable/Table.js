import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './customtable.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import ModalImage from '~/components/Modal/ImageModal';

const cx = classNames.bind(styles);

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function CustomTable({ data, columns, onViewLink, onEditLink, onDelete, checkboxData, onCheckboxChange }) {
    const [selectedRows, setSelectedRows] = useState([]);
    const [modalImageUrl, setModalImageUrl] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (imageUrl) => {
        setModalImageUrl(imageUrl);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCheckboxChange = (event, _id) => {
        const checked = event.target.checked;

        if (_id === 'all') {
            const allRowIds = data.map((row) => row._id);
            setSelectedRows(checked ? allRowIds : []);
            onCheckboxChange && onCheckboxChange(checked ? allRowIds : []);
        } else {
            const updatedSelectedRows = checked
                ? [...selectedRows, _id]
                : selectedRows.filter((rowId) => rowId !== _id);
            setSelectedRows(updatedSelectedRows);
            onCheckboxChange && onCheckboxChange(updatedSelectedRows);
        }
    };
    const limitWords = (text, limit) => {
        const words = text.split(' ');
        if (words.length > limit) {
            return words.slice(0, limit).join(' ') + '...';
        }
        return text;
    };

    // Render nội dung của cột HTML với giới hạn số từ
    const renderHtmlColumnContent = (htmlContent, limit) => {
        const div = document.createElement('div');
        div.innerHTML = htmlContent;
        return limitWords(div.textContent, limit);
    };
    if (!data || data.length === 0) {
        return <div>No data available</div>;
    }

    return (
        <div>
            <table className={styles.customTable}>
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={selectedRows.length === data.length}
                                onChange={(event) => handleCheckboxChange(event, 'all')}
                            />
                        </th>
                        {columns.map((column, index) => (
                            <th key={index} className={cx(column.classNameHeader)}>
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedRows.includes(row._id)}
                                    onChange={(event) => handleCheckboxChange(event, row._id)}
                                />
                            </td>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex}>
                                    {column.isAction && (
                                        <div className={cx('wrap-actions')}>
                                            {onViewLink && (
                                                <Link to={onViewLink(row)} className={cx('actionButton')}>
                                                    <FontAwesomeIcon icon={faEye} className={cx('view-icon')} />
                                                </Link>
                                            )}
                                            {onEditLink && (
                                                <Link to={onEditLink(row)} className={cx('actionButton')}>
                                                    <FontAwesomeIcon icon={faPen} className={cx('edit-icon')} />
                                                </Link>
                                            )}
                                            {onDelete && (
                                                <button onClick={() => onDelete(row)} className={cx('actionButton')}>
                                                    <FontAwesomeIcon icon={faTrash} className={cx('delete-icon')} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    {!column.isAction && column.isHTML ? (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: renderHtmlColumnContent(row[column.key], 200), // Giới hạn số từ là 10
                                            }}
                                            className={cx(column.classNameHtml)}
                                        />
                                    ) : !column.isAction && column.isImage ? (
                                        row[column.key] === 'No image' ? (
                                            <span>No image</span>
                                        ) : (
                                            <img
                                                src={row[column.key]}
                                                alt={`Image_${rowIndex}`}
                                                className={cx(column.classNameImage)}
                                                onClick={() => handleOpenModal(row[column.key])}
                                            />
                                        )
                                    ) : !column.isAction ? (
                                        column.key === 'createdAt' ? (
                                            formatDate(row[column.key])
                                        ) : (
                                            <span
                                                className={
                                                    row.isPresent === 'Đã điểm danh'
                                                        ? cx(column.classNameData2)
                                                        : cx(column.classNameData1)
                                                }
                                            >
                                                {row[column.key]}
                                            </span>
                                        )
                                    ) : null}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && <ModalImage imageUrl={modalImageUrl} onClose={handleCloseModal} />}
        </div>
    );
}

export default CustomTable;
