import axios from 'axios';
import { baseURL } from './api';
import { jwtDecode } from 'jwt-decode';

const refreshToken = async () => {
    try {
        const res = await axios.post(
            baseURL + 'v1/auth/refresh',
            {},
            {
                withCredentials: true,
            },
        );
        console.log('Dữ liệu trả về từ refreshToken:', res.data); // Log dữ liệu từ refreshToken
        // Xử lý dữ liệu trả về từ refreshToken nếu cần
        return res.data;
    } catch (error) {
        console.error('Lỗi trong refreshToken:', error);
        // Xử lý lỗi nếu cần thiết
    }
};

export const createInstance = (user, dispatch, stateSuccess, stateData) => {
    const instance = axios.create();
    instance.interceptors.request.use(
        async (config) => {
            let date = new Date();
            // Ensure that the accessToken is available before trying to decode it
            if (user?.accessToken) {
                const decodedToken = jwtDecode(user.accessToken);
                if (decodedToken.exp < date.getTime() / 1000) {
                    try {
                        const data = await refreshToken();
                        const refreshUser = {
                            ...user,
                            accessToken: data.accessToken,
                        };

                        dispatch(stateSuccess(refreshUser));
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
    return instance;
};
