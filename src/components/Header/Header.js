import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import style from './Header.module.scss';
import facebook from '~/assets/facebook.png';
import google from '~/assets/google.png';
import logo from '~/assets/tdmu-icon-ldpi.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faSearch } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountItem from '../AccountItem/AccountItem';
import BlogItem from '../BlogItem/BlogItem';
import Button from '~/components/Button';
import Modal from '../Modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, logoutUser } from '~/redux/apiRequest';
import { baseURL } from '~/utils/api';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const cx = classNames.bind(style);

function Header() {
    const [searchResult, setSearchResult] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isForm, setIsForm] = useState(true);

    //open and close from avatar
    const [show, setShow] = useState(false);
    const handleShowAction = () => {
        setShow(!show);
    };

    // display user information
    const user = useSelector((state) => state.auth.login.currentUser);

    // define for form
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    //api ssearch

    const handleSearchChange = async (e) => {
        const query = e.target.value;

        // Kiểm tra nếu giá trị query là rỗng, không cần gọi API và ẩn Tippy
        if (query.trim() === '') {
            setSearchResult([]);
            return;
        }

        try {
            const response = await fetch(baseURL + `api/search?q=${query}`);
            const data = await response.json();
            setSearchResult(data);
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    // login function
    const handleLogin = (e) => {
        e.preventDefault();
        const newUser = {
            username,
            password,
        };
        loginUser(newUser, dispatch, navigate, closeModal);
    };

    //logout function
    const handleLogout = () => {
        logoutUser(dispatch, navigate);
        setShow(false);
    };
    // func for modal
    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };
    // have a current user login
    // search result
    useEffect(() => {
        setTimeout(() => {
            setSearchResult([]);
        }, 0);
    }, []);

    return (
        <div className={cx('wrapper-all')}>
            <ToastContainer autoClose={3000} />

            <header className={cx('wrapper')}>
                <div className={cx('logo')}>
                    <Link to={'/'}>
                        <img className={cx('img')} src={logo} alt="logo tdmu" />
                    </Link>
                    <h4>Quản lý hoạt động cá nhân</h4>
                </div>
                <Tippy
                    visible={searchResult.length > 0}
                    interactive
                    render={(attrs) => (
                        <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                            <PopperWrapper>
                                <h4 className={cx('search-title')}>Accounts</h4>
                                <AccountItem searchResults={searchResult} />
                                <h4 className={cx('search-title')}>Blogs</h4>
                                <BlogItem searchResults={searchResult} />
                            </PopperWrapper>
                        </div>
                    )}
                >
                    <div className={cx('search')}>
                        <input placeholder="Tìm kiếm bài viết, người dùng,.." onChange={(e) => handleSearchChange(e)} />
                        <FontAwesomeIcon className={cx('search-icon')} icon={faSearch} />
                    </div>
                </Tippy>

                {user ? (
                    <div className={cx('current-user')}>
                        <FontAwesomeIcon className={cx('action-icon')} icon={faBell} />
                        <Tippy
                            visible={show}
                            interactive
                            render={(attrs) => (
                                <div className={cx('wrap-action-avatar')} tabIndex="-1" {...attrs}>
                                    <ul className={cx('list-action')}>
                                        <li className={cx('item-action')}>
                                            <Link to={'/me'} className={cx('text-link')}>
                                                Trang cá nhân
                                            </Link>
                                        </li>
                                        <li onClick={handleLogout} className={cx('item-action')}>
                                            Đăng xuất
                                        </li>
                                    </ul>
                                </div>
                            )}
                        >
                            <img
                                className={cx('img-user')}
                                src={user.avatar}
                                alt={user.username}
                                onClick={handleShowAction}
                            />
                        </Tippy>
                    </div>
                ) : (
                    <div className={cx('actions')}>
                        <Button small onClick={openModal}>
                            Đăng nhập
                        </Button>
                        <Button
                            primary
                            small
                            onClick={() => {
                                openModal();
                                setIsForm(false);
                            }}
                        >
                            Đăng ký
                        </Button>
                    </div>
                )}
            </header>

            {modalOpen && (
                <Modal onClose={closeModal}>
                    <div className={cx('container-modal')}>
                        <img className={cx('img-modal')} src={logo} alt="logo tdmu" />
                        <h2>{isForm ? 'Đăng nhập' : 'Đăng ký'} Tdmu Manager</h2>

                        <div className={cx('wrap-action')}>
                            <button className={cx('btn-action')}>
                                <img className={cx('img-icon-google')} src={google} alt="" />
                                <h3 className={cx('text-btn')}>{isForm ? 'Đăng nhập' : 'Đăng ký'} với google</h3>
                            </button>

                            <button className={cx('btn-action')}>
                                <img className={cx('img-icon')} src={facebook} alt="" />
                                <h3 className={cx('text-btn')}>{isForm ? 'Đăng nhập' : 'Đăng ký'} với facebook</h3>
                            </button>
                        </div>
                        <h3> Hoặc</h3>
                        <div className={cx('wrap-form')}>
                            <form onSubmit={handleLogin}>
                                <div className={cx('wrap-form-input')}>
                                    <input
                                        type="text"
                                        placeholder="Nhập tên đăng nhập"
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className={cx('wrap-form-input')}>
                                    <input
                                        type="password"
                                        placeholder="Nhập mật khẩu"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className={cx('btn-form')}>
                                    {isForm ? 'Đăng nhập' : 'Đăng ký'}
                                </button>
                            </form>
                        </div>
                        {isForm ? (
                            <h4 className={cx('route-text-modal')}>
                                Bạn chưa có tài khoản?
                                <button className={cx('text-link-modal')} onClick={() => setIsForm(!isForm)}>
                                    Đăng ký
                                </button>
                            </h4>
                        ) : (
                            <h4 className={cx('route-text-modal')}>
                                Bạn đã có tài khoản?
                                <button className={cx('text-link-modal')} onClick={() => setIsForm(!isForm)}>
                                    Đăng nhập
                                </button>
                            </h4>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default Header;
