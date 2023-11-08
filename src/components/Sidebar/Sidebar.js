import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCalendar, faNewspaper } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Sidebar() {
    return (
        <div className={cx('wrapper')}>
            <ul className={cx('nav-list')}>
                <li className={cx('list-item', 'list-item-active')}>
                    <FontAwesomeIcon icon={faHouse} />
                    <h4>Home</h4>
                </li>
                <li className={cx('list-item')}>
                    <FontAwesomeIcon icon={faNewspaper} />
                    <h4>Blog</h4>
                </li>
                <li className={cx('list-item')}>
                    <FontAwesomeIcon icon={faCalendar} />
                    <h4>Schedule</h4>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
