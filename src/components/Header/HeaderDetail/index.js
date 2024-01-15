import classNames from 'classnames/bind';
import style from './HeaderDetail.module.scss';
import { Link } from 'react-router-dom';
import logo from '~/assets/tdmu-icon-ldpi.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(style);

function Header() {
    return (
        <div className={cx('wrapper-all')}>
            <header className={cx('wrapper')}>
                <div className={cx('logo')}>
                    <img className={cx('img')} src={logo} alt="logo tdmu" />
                    <button className={cx('btn-action')}>
                        <Link to={'/'}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                            <span> Quay lại</span>
                        </Link>
                    </button>
                </div>
            </header>
        </div>
    );
}

export default Header;
