import classNames from 'classnames/bind';
import style from './UserGroup.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(style);
function UserGroup({ imgURL, name, btn = false, onAdd, isAdded, onDelete }) {
    return (
        <div className={cx('wrapper', { 'wrapper-added': isAdded })} onClick={onAdd}>
            <div className={cx('wrap-info')}>
                <img src={imgURL} alt={name} className={cx('img')} />
                <h5 className={cx('name')}>{name}</h5>
                {btn && (
                    <button className={cx('btn-icon')} onClick={onDelete}>
                        <FontAwesomeIcon icon={faXmarkCircle} className={cx('icon')} />
                    </button>
                )}
            </div>
        </div>
    );
}

export default UserGroup;
