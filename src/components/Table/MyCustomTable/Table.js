import React from 'react';
import classNames from 'classnames/bind';
import styles from './customtable.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function CustomTable({ data, columns, onView, onEdit, onDelete }) {
    if (!data || data.length === 0) {
        return <div>No data available</div>;
    }

    return (
        <table className={cx('customTable')}>
            <thead>
                <tr>
                    {columns.map((column, index) => (
                        <th key={index}>{column.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((column, colIndex) => (
                            <td key={colIndex}>
                                {column.isAction && (
                                    <div className={cx('wrap-actions')}>
                                        {onView && (
                                            <button onClick={() => onView(row)} className={cx('actionButton')}>
                                                <FontAwesomeIcon icon={faEye} className={cx('view-icon')} />
                                            </button>
                                        )}
                                        {onEdit && (
                                            <button onClick={() => onEdit(row)} className={cx('actionButton')}>
                                                <FontAwesomeIcon icon={faPen} className={cx('edit-icon')} />{' '}
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button onClick={() => onDelete(row)} className={cx('actionButton')}>
                                                <FontAwesomeIcon icon={faTrash} className={cx('delete-icon')} />
                                            </button>
                                        )}
                                    </div>
                                )}
                                {!column.isAction && column.isHTML ? (
                                    <div dangerouslySetInnerHTML={{ __html: row[column.key] }} />
                                ) : !column.isAction ? (
                                    column.key === 'createdAt' ? (
                                        formatDate(row[column.key])
                                    ) : (
                                        row[column.key]
                                    )
                                ) : null}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default CustomTable;
