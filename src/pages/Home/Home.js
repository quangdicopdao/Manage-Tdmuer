import classNames from 'classnames/bind';
import style from './Home.module.scss';
import MyTable from '~/components/Table';
import { useSelector } from 'react-redux';

const cx = classNames.bind(style);

function Home() {
    const user = useSelector((state) => state.auth.login?.currentUser);

    return user ? (
        <div className={cx('wrapper')}>
            <div className={cx('wrap-table')}>
                <MyTable />
            </div>
        </div>
    ) : null;
}

export default Home;
