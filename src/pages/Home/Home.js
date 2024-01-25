import classNames from 'classnames/bind';
import style from './Home.module.scss';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import MyTable from '~/components/Table';
import { useDispatch, useSelector } from 'react-redux';
import { baseURL } from '~/utils/api';
import { loginSuccess } from '~/redux/authSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(style);

function Home() {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let axiosJWT = axios.create();

    const refreshToken = async () => {
        try {
            const res = await axios.post(baseURL + 'v1/auth/refresh', null, {
                withCredentials: true,
                headers: {
                    Cookies: user?.accessToken,
                },
            });
            console.log('token', res.data);
            return res.data;
        } catch (error) {
            console.error(error);
            throw error; // Re-throw the error for further handling if needed
        }
    };

    axiosJWT.interceptors.request.use(
        async (config) => {
            let date = new Date();
            // Ensure that the accessToken is available before trying to decode it
            if (user?.accessToken) {
                const decodedToken = jwtDecode(user.accessToken);
                console.log('time', date.getTime() / 1000);
                if (decodedToken.exp < date.getTime() / 1000) {
                    try {
                        const data = await refreshToken();
                        console.log('token', data);
                        const refreshUser = {
                            ...user,
                            accessToken: data.accessToken,
                        };
                        console.log('token', data.accessToken);

                        dispatch(loginSuccess(refreshUser));
                        config.headers['Authorization'] = 'Bearer ' + data.accessToken;
                    } catch (error) {
                        // Handle refresh token error if needed
                        console.error('Error refreshing token:', error);
                    }
                }
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        },
    );

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className={cx('wrapper')}>
            {user && (
                <div className={cx('wrap-table')}>
                    <MyTable accessToken={user.accessToken} axiosJWT={axiosJWT} />
                </div>
            )}
        </div>
    );
}

export default Home;
