import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';

const cx = classNames.bind(styles);

function AccountItem() {
    return (
        <div className={cx('wrapper')}>
            <img
                className={cx('avatar')}
                src="https://scontent.fsgn21-1.fna.fbcdn.net/v/t39.30808-6/378393423_1307195950164637_4310189808608344293_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gByMQlsaVTcAX-G-MvD&_nc_ht=scontent.fsgn21-1.fna&oh=00_AfCVJAMePvXnfypds0z-fCgALCvg0isft_ajv9xFRrLU7A&oe=655104E4"
                alt="name"
            />
            <div className={cx('content')}>
                <h4 className={cx('username')}>Đặng Việt Quang</h4>
            </div>
        </div>
    );
}

export default AccountItem;
