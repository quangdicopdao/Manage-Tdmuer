import classNames from 'classnames/bind';
import style from './Home.module.scss';
import MyTable from '~/components/Table';
const cx = classNames.bind(style);

function Home() {
    
    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrap-table')}>
                <MyTable />
            </div>
        </div>
    );
}

export default Home;
