import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import style from './Header.module.scss';
import logo from '~/assets/tdmu-icon-ldpi.png';
import facebook from '~/assets/facebook.png';
import google from '~/assets/google.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css'; // optional
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountItem from '../AccountItem/AccountItem';
import BlogItem from '../BlogItem/BlogItem';
import Button from '~/components/Button';
import Modal from '../Modal/Modal';

const cx = classNames.bind(style);
function Header() {
    const [searchResult, setSearchResult] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const [user, setUser] = useState(null);

    // func for modal
    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };
    // have a current user login
    //search result
    useEffect(() => {
        setTimeout(() => {
            setSearchResult([]);
        }, 0);
    }, []);

    return (
        <div className={cx('wrapper-all')}>
            <header className={cx('wrapper')}>
                <div className={cx('logo')}>
                    <img className={cx('img')} src={logo} alt="logo tdmu" />
                    <h4>Quản lý hoạt động cá nhân</h4>
                </div>
                <Tippy
                    visible={searchResult.length > 0}
                    interactive
                    render={(attrs) => (
                        <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                            <PopperWrapper>
                                <h4 className={cx('search-title')}>Accounts</h4>
                                <AccountItem />
                                <AccountItem />
                                <h4 className={cx('search-title')}>Blogs</h4>
                                <BlogItem />
                                <BlogItem />
                                <BlogItem />
                            </PopperWrapper>
                        </div>
                    )}
                >
                    <div className={cx('search')}>
                        <input placeholder="Tìm kiếm bài viết, người dùng,.." />
                        <FontAwesomeIcon className={cx('search-icon')} icon={faMagnifyingGlass} />
                    </div>
                </Tippy>

                {user ? (
                    <div className={cx('current-user')}>
                        <FontAwesomeIcon className={cx('action-icon')} icon={faBell} />
                        <FontAwesomeIcon className={cx('action-icon')} icon={faFacebookMessenger} />
                        <img
                            className={cx('img-user')}
                            src="https://scontent.fsgn21-1.fna.fbcdn.net/v/t39.30808-6/378393423_1307195950164637_4310189808608344293_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gByMQlsaVTcAX-G-MvD&_nc_ht=scontent.fsgn21-1.fna&oh=00_AfCVJAMePvXnfypds0z-fCgALCvg0isft_ajv9xFRrLU7A&oe=655104E4"
                            alt="name"
                        />
                    </div>
                ) : (
                    <div className={cx('actions')}>
                        <Button small onClick={openModal}>
                            Đăng nhập
                        </Button>
                        <Button primary small onClick={openModal}>
                            Đăng ký
                        </Button>
                    </div>
                )}
            </header>

            {modalOpen && (
                <Modal onClose={closeModal}>
                    <div className={cx('container-modal')}>
                        <img className={cx('img-modal')} src={logo} alt="logo tdmu" />
                        <h2>Đăng nhập Tdmu Manager</h2>

                        <div className={cx('wrap-action')}>
                            <a href="/login/federated/google" className={cx('btn-action')}>
                                <img className={cx('img-icon-google')} src={google} alt="" />
                                <h3 className={cx('text-btn')}>Đăng nhập với google</h3>
                            </a>
                            <a href="/login/federated/facebook" className={cx('btn-action')}>
                                <img className={cx('img-icon')} src={facebook} alt="" />
                                <h3 className={cx('text-btn')}>Đăng nhập với facebook</h3>
                            </a>
                        </div>

                        <h4 className={cx('route-text-modal')}>
                            Bạn chưa có tài khoản?
                            <a href="/" className={cx('text-link-modal')}>
                                Đăng ký
                            </a>
                        </h4>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default Header;
