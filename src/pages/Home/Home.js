import classNames from 'classnames/bind';
import style from './Home.module.scss';
import MyTable from '~/components/Table';
import { useSelector } from 'react-redux';
import MyCustomCalendar from '~/components/Calendar/MyCustomCalendar';
const cx = classNames.bind(style);

function Home() {
    const user = useSelector((state) => state.auth.login?.currentUser);

    return user ? (
        <div className={cx('wrapper')}>
            <div className={cx('wrap-table')}>
                <MyTable />
            </div>
            {/* <MyCustomCalendar /> */}
        </div>
    ) : null;
}

export default Home;
