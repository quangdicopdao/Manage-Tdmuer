import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './customtable.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import ModalImage from '~/components/Modal/ImageModal';
import { Image } from 'cloudinary-react';

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
        console.log('imageUrl');
        setModalImageUrl(imageUrl);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleCheckboxChange = (event, rowIndex) => {
        const checked = event.target.checked;
        if (checked) {
            setSelectedRows([...selectedRows, rowIndex]);
        } else {
            setSelectedRows(selectedRows.filter((index) => index !== rowIndex));
        }
        onCheckboxChange && onCheckboxChange(selectedRows);
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
                                onChange={(event) => {
                                    if (event.target.checked) {
                                        setSelectedRows(Array.from({ length: data.length }, (_, i) => i));
                                    } else {
                                        setSelectedRows([]);
                                    }
                                }}
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
                                    checked={selectedRows.includes(rowIndex)}
                                    onChange={(event) => handleCheckboxChange(event, rowIndex)}
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
                                                    <FontAwesomeIcon icon={faPen} className={cx('edit-icon')} />{' '}
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
                                            dangerouslySetInnerHTML={{ __html: row[column.key] }}
                                            className={cx(column.classNameHtml)}
                                        />
                                    ) : !column.isAction && column.isImage ? (
                                        // <Image cloudName={process.env.REACT_APP_CLOUDINARY_CLOUD_NAME} publicId={row[column.key]} className={cx(column.classNameImage)}/>
                                        row[column.key] === 'No image' ? (
                                            <span>No image</span>
                                        ):(
                                            
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
                                                className={cx(
                                                    column.isPresent ? column.classNameData2 : column.classNameData1,
                                                )}
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
