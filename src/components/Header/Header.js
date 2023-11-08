import classNames from 'classnames/bind';
import style from './Header.module.scss';
import logo from '~/assets/tdmu-icon-ldpi.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(style);
function Header() {
    return (
        <header className={cx('wrapper')}>
            <div className={cx('logo')}>
                <img className={cx('img')} src={logo} alt="logo tdmu" />
                <h4>Quản lý hoạt động cá nhân</h4>
            </div>
            <div className={cx('search')}>
                <input placeholder="Tìm kiếm bài viết, người dùng,.." />
                <FontAwesomeIcon className={cx('search-icon')} icon={faMagnifyingGlass} />
            </div>
            <div className={cx('actions')}>
                <button className={cx('actions-btn', 'primary-btn')}>Log in</button>
                <button className={cx('actions-btn')}>Sign up</button>
            </div>
        </header>
    );
}

export default Header;
