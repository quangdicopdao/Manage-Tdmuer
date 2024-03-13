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
import { loginUser, logoutUser,loginUserWithFacebook,loginUserWithGoogle } from '~/redux/apiRequest';
import { baseURL } from '~/utils/api';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import OAuth2Login from 'react-simple-oauth2-login';
import axios from 'axios';
import { gapi } from 'gapi-script';
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
    const clientId = "167804317966-4om60dtbnb2qoiu6ncpsao69bo3gka12.apps.googleusercontent.com";

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
    // Truyền thông tin người dùng khi click vào AccountItem
    const handleAccountItemClick = (userData) => {
        // Chuyển hướng đến trang Me và truyền dữ liệu người dùng
        navigate('/me', { state: { userData } });
    };


    //login google
    const responseGoogle = (response) => {
        console.log("Login success:", response.profileObj);
        //Xử lý thông tin người dùng sau khi đăng nhập thành công
        const { profileObj } = response;
        const newUser = {
            username: profileObj.name,
            email: profileObj.email,
        };
        // Gọi hàm xử lý đăng nhập hoặc tạo tài khoản mới
        loginUserWithGoogle(newUser,dispatch, navigate, closeModal);
    };

    //
    const responseGoogleFailure = (response) => {
        console.log("Login failure:", response);
        // Xử lý khi đăng nhập bằng Google thất bại
    };

      //login facebook
      const onSuccess = async (res) => {
        try {
            const accessToken = res.access_token;
            const result = await fetch(`https://graph.facebook.com/me?fields=name,email&access_token=${accessToken}`);
            const profile = await result.json();
            
            // Bổ sung các thông tin khác nếu cần thiết
            // avatar, gender, dob, etc.
            // Ví dụ: profile.avatar = 'URL_OF_AVATAR';
            // Gọi hàm xử lý đăng nhập hoặc tạo tài khoản mới
            loginUserWithFacebook(profile, dispatch, navigate, closeModal);
        } catch (error) {
            console.error('Error logging in with Facebook:', error);
        }
    };

      const onFailure = (res) =>{
        console.log(res)
      }
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
                                <AccountItem searchResults={searchResult} onAccountItemClick={handleAccountItemClick} />
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
                                            <Link to={`/profile/${user?._id}`} className={cx('text-link')}>
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
                            <GoogleLogin
                                className={cx('google-login-btn')}
                                clientId={clientId}
                                buttonText="Login with Google"
                                onSuccess={responseGoogle}
                                onFailure={responseGoogleFailure}
                                cookiePolicy={'single_host_origin'}
                                isSignedIn={false}
                            />
                            
                            {/* Nút đăng nhập bằng Google */}
                            <OAuth2Login
                                className={cx('facebook-login-btn')}
                                buttonText="Login with Facebook"
                                authorizationUrl="https://www.facebook.com/dialog/oauth"
                                responseType="token"
                                clientId="2460389754168770"
                                redirectUri="http://localhost:3000"
                                scope='email'
                                onSuccess={onSuccess}
                                onFailure={onFailure}/>
                               
                        </div>
                      
                        <h3 style={{marginTop:10}}>Hoặc</h3>
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
