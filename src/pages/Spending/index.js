import className from 'classnames/bind';
import style from './Spending.module.scss';
import wallet from '~/assets/wallet.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
const cx = className.bind(style);

function Spending() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header-info')}>
                <img src={wallet} alt="ví tiền" className={cx('img-wallet')} />
                <div className={cx('wrap-money')}>
                    <span className={cx('title-money')}>Số dư ví</span>
                    <span className={cx('money')}>123.000VND</span>
                </div>
            </div>
            <div className={cx('grid')}>
                <div className={cx('col-7')}>
                    <div className={cx('new-spend')}>
                        <div className={cx('wrap-icon')}>
                            <FontAwesomeIcon icon={faPenToSquare} className={cx('icon-edit')} />
                            <FontAwesomeIcon icon={faTrash} className={cx('icon-trash')} />
                        </div>
                        <div>
                            <h3 className={cx('title-spend')}>Tiền cho sugar baby</h3>
                            <span className={cx('content-spend')}>Chi cho thằng Nhân bede</span>
                        </div>
                    </div>
                </div>
                <div className={cx('col-3')}></div>
            </div>
        </div>
    );
}

export default Spending;
