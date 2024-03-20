import React from 'react';
import { Link } from 'react-router-dom';
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

function CustomTable({ data, columns, onViewLink, onEditLink, onDelete }) {
    if (!data || data.length === 0) {
        return <div>No data available</div>;
    }

    return (
        <table className={styles.customTable}>
            <thead>
                <tr>
                    {columns.map((column, index) => (
                        <th key={index} className={cx(column.className)}>
                            {column.label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((column, colIndex) => (
                            <td key={colIndex} className={cx(column.className)}>
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
