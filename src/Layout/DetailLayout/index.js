import Header from '~/components/Header/HeaderDetail';
import Footer from '~/components/Footer/Footer';
import Sidebar from '~/components/Sidebar/Sidebar';
import classNames from 'classnames/bind';
import styles from '~/Layout/DefaultLayout/DefaultLayout.module.scss';
const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div>
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
