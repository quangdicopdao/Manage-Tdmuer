import classNames from 'classnames/bind';
import style from './Notification.module.scss';

const cx = classNames.bind(style);

function Notification({ status, title, message }) {
    return <div className={cx('wrapper')}></div>;
}

export default Notification;
