import axios from 'axios';
import {
    loginFailed,
    loginStart,
    loginSuccess,
    createPostFailed,
    createPostSuccess,
    registerFailed,
    registerStart,
    registerSuccess,
    logoutStart,
    logoutSuccess,
    logoutFailed,
} from './authSlice';
import { baseURL } from '~/utils/api';
import {
    createScheduleFailer,
    createScheduleSuccess,
    getScheduleFailer,
    getScheduleStart,
    getScheduleSuccess,
} from './scheduleSlice';
import { toast } from 'react-toastify';

// authenication
export const loginUser = async (user, dispatch, navigate, closeModal) => {
    dispatch(loginStart());
    try {
        const res = await axios.post(baseURL + 'v1/auth/login', user, {
            withCredentials: true,
        });
        console.log('Login success:', res.data);
        dispatch(loginSuccess(res.data));

        navigate('/');
        toast.success('Đăng nhập thành công');
        closeModal();
    } catch (error) {
        toast.error('Sai tài khoản hoặc mật khẩu');
        console.log('Login failed:', error.response.data);
        dispatch(loginFailed(error.response.data));
    }
};
export const registerUser = async (user, dispatch, navigate, openModalLogin) => {
    dispatch(registerStart());
    try {
        await axios.post(baseURL + 'v1/auth/register', user);
        dispatch(registerSuccess());
        navigate('/');
        openModalLogin();
    } catch (err) {
        dispatch(registerFailed());
    }
};
export const logoutUser = async (dispatch, navigate) => {
    dispatch(logoutStart());
    try {
        dispatch(logoutSuccess());
        navigate('/');
    } catch (error) {
        dispatch(logoutFailed());
    }
};

//post
export const createPost = async (data, dispatch, navigate, accessToken) => {
    try {
        const res = await axios.post(baseURL + 'api/posts/create', data, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        dispatch(createPostSuccess(res.data));
        navigate('/post');
    } catch (error) {
        console.error('Error:', error.response.data);
        dispatch(createPostFailed(error.response.data));
    }
};
//schedule
export const createSchedule = async (data, dispatch, navigate, accessToken, axiosJWT) => {
    try {
        const res = await axiosJWT.post(baseURL + 'schedule/api/create', data, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        dispatch(createScheduleSuccess(res.data));
        navigate('/schedule');
        toast.success('Tạo lịch thành công');
    } catch (error) {
        console.error('Error:', error.response.data);
        toast.error('Lỗi khi tạo lịch');
        dispatch(createScheduleFailer(error.response.data));
    }
};

export const showSchedule = async (dispatch, axiosJWT, accessToken) => {
    dispatch(getScheduleStart());
    try {
        const res = await axiosJWT.get(baseURL + 'schedule/api/show', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        dispatch(getScheduleSuccess(res.data));
    } catch (error) {
        dispatch(getScheduleFailer(error));
    }
};

